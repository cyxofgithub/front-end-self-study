# [RabbitMQ 教程 - "Hello World!"](https://www.rabbitmq.com/tutorials/tutorial-one-javascript)

## 简介

RabbitMQ 是一个消息代理：它接受并转发消息。您可以把它想象成一个邮局：当您把想要投递的邮件放在邮筒里时，您可以确信信件承运人最终会把邮件送到您的收件人手中。在这个比喻中，RabbitMQ 就是邮筒、邮局和信件承运人。

RabbitMQ 与邮局的主要区别在于它不处理纸张，而是接受、存储和转发二进制数据块--消息。

RabbitMQ 和一般的消息传递都使用以下术语：

-   生产的含义不过是发送。发送信息的程序就是生产者。
-   队列是 RabbitMQ 中邮筒的名称。虽然消息在 RabbitMQ 和您的应用程序中流动，但它们只能存储在队列中。队列只受主机内存和磁盘限制的约束，本质上就是一个大型消息缓冲区。

许多生产者可以发送信息到一个队列，许多消费者可以尝试从一个队列接收数据。

-   消费的含义与接收类似。消费者是一个主要等待接收信息的程序

请注意，生产者、消费者和经纪人不必位于同一主机上；事实上，在大多数应用程序中都不是这样。应用程序也可以既是生产者又是消费者。

## Hello World

### 使用 amqp.node 客户端

在这部分教程中，我们将用 Javascript 编写两个小程序：一个是发送单条消息的生产者，另一个是接收消息并打印出来的消费者。我们将略过 amqp.node API 中的一些细节，只专注于这个非常简单的东西，以便开始学习。这是一个消息传递的 "Hello World"。

**amqp.node 客户端库**

RabbitMQ 支持多种协议。本教程使用 AMQP 0-9-1，这是一种开放的通用消息传递协议。RabbitMQ 有许多不同语言的客户端。我们将在本教程中使用 amqp.node 客户端。

首先，使用 npm 安装：

```bash
npm install amqplib
```

现在我们已经安装了 amqp.node，可以编写一些代码了。

### 发送

我们将调用我们的消息发布者（发送者）send.js 和我们的消息消费者（接收者）receive.js。发布者将连接 RabbitMQ，发送一条消息，然后退出。

在 send.js 中，我们首先需要该库：

```javascript
const amqp = require("amqplib/callback_api");
```

然后连接 RabbitMQ 服务器:

```javascript
amqp.connect("amqp://localhost", function(error0, connection) {});
```

接下来，我们创建一个频道，这是用于完成任务的大部分 API 所在的地方：

```javascript
amqp.connect("amqp://localhost", function(error0, connection) {
    if (error0) {
        throw error0;
    }
    connection.createChannel(function(error1, channel) {});
});
```

要发送信息，我们必须声明一个队列供我们发送到该队列；然后我们就可以向该队列发布一条信息：

```javascript
amqp.connect("amqp://localhost", function(error0, connection) {
    if (error0) {
        throw error0;
    }
    connection.createChannel(function(error1, channel) {
        if (error1) {
            throw error1;
        }
        const queue = "hello";
        const msg = "Hello world";

        channel.assertQueue(queue, {
            durable: false,
        });

        channel.sendToQueue(queue, Buffer.from(msg));
        console.log(" [x] Sent %s", msg);
    });
});
```

声明队列是幂等的(idempotent)--只有当队列不存在时才会创建。信息内容是一个字节数组，所以你可以在其中任意编码。

最后，我们关闭连接并退出:

```javascript
setTimeout(function() {
    connection.close();
    process.exit(0);
}, 500);
```

### 接收

这就是我们的发布者。我们的消费者会监听来自 RabbitMQ 的消息，因此与只发布一条消息的发布者不同，我们将保持消费者运行以监听消息并打印出来。

代码（[receive](../demo/Hello%20World/receive.js).js 中）的 require 与 send 相同：

```javascript
#!/usr/bin/env node

const amqp = require("amqplib/callback_api");
```

设置与发布者相同；我们打开一个连接和一个通道，并声明我们要从哪个队列消费。请注意，这与 sendToQueue 发布到的队列一致。

```javascript
amqp.connect("amqp://localhost", function(error0, connection) {
    if (error0) {
        throw error0;
    }
    connection.createChannel(function(error1, channel) {
        if (error1) {
            throw error1;
        }
        var queue = "hello";

        channel.assertQueue(queue, {
            durable: false,
        });
    });
});
```

请注意，我们在这里也声明了队列。因为我们可能会在发布者之前启动消费者，所以我们要确保队列存在，然后再尝试从队列中消费消息。

我们要告诉服务器将队列中的消息传递给我们。由于它将以异步方式向我们推送消息，因此我们要提供一个回调，当 RabbitMQ 向我们的消费者推送消息时执行该回调。这就是 Channel.consume 的作用。

```javascript
console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);
channel.consume(
    queue,
    function(msg) {
        console.log(" [x] Received %s", msg.content.toString());
    },
    {
        noAck: true,
    }
);
```

请注意，我们在这里也声明了队列。因为我们可能会在发布者之前启动消费者，所以我们要确保队列存在，然后再尝试从队列中消费消息。

我们要告诉服务器将队列中的消息传递给我们。由于它将以异步方式向我们推送消息，因此我们要提供一个回调，当 RabbitMQ 向我们的消费者推送消息时执行该回调。这就是 Channel.consume 的作用。

```javascript
console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);
channel.consume(
    queue,
    function(msg) {
        console.log(" [x] Received %s", msg.content.toString());
    },
    {
        noAck: true,
    }
);
```

### 将所有内容整合在一起

现在我们可以运行这两个脚本了。在终端中，从运行发布器：

```bash
node send.js
```

然后运行消费者：

```bash
node receive.js
```

消费者将打印通过 RabbitMQ 从发布者处获得的消息。消费者将继续运行，等待消息（使用 Ctrl-C 停止），因此请尝试从另一个终端运行发布者。

> **列出队列**
> 您可能希望查看 RabbitMQ 有哪些队列以及其中有多少条消息。您可以使用 **rabbitmqctl** 工具（以特权用户身份）进行查看：

```bash
sudo rabbitmqctl list_queues
```

在 Windows 系统中，省略 sudo：

```bash
rabbitmqctl.bat list_queues
```

是时候进入第二部分，建立一个简单的工作队列了。
