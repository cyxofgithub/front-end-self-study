package com.exam.handler;

import cn.dev33.satoken.exception.NotLoginException;
import cn.dev33.satoken.exception.NotPermissionException;
import com.exam.utils.CommonEnum;
import com.exam.utils.LogicException;
import com.exam.utils.ResultBody;
import org.apache.log4j.Logger;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;

import jakarta.servlet.http.HttpServletRequest;


@ControllerAdvice
public class GlobalExceptionHandler {
    static Logger logger = Logger.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(value = LogicException.class)
    @ResponseBody
    public ResultBody bizExceptionHandler(HttpServletRequest req, LogicException e){
        logger.error("发生业务异常！原因是："+ e.getErrorMsg());
        return ResultBody.error(e.getErrorCode(),e.getErrorMsg());
    }

    @ExceptionHandler(value =NullPointerException.class)
    @ResponseBody
    public ResultBody exceptionHandler(HttpServletRequest req, NullPointerException e){
        logger.error("发生空指针异常！原因是:" + e);
        return ResultBody.error(CommonEnum.BODY_NOT_MATCH);
    }

    @ExceptionHandler(value = NotLoginException.class)
    @ResponseBody
    public ResultBody loginExceptionHandler(HttpServletRequest req, NotLoginException e){
        logger.error("用户未获取有效token！");
        return ResultBody.error(CommonEnum.NOT_LOGIN);
    }

    @ExceptionHandler(value = NotPermissionException.class)
    @ResponseBody
    public ResultBody permissionExceptionHandler(HttpServletRequest req, NotPermissionException e){
        logger.error("用户token没有权限" + e);
        return ResultBody.error(CommonEnum.WRONG_PERMISSION);
    }

    @ExceptionHandler(value =Exception.class)
    @ResponseBody
    public ResultBody exceptionHandler(HttpServletRequest req, Exception e){
        logger.error("未知异常！原因是:" + e);
        return ResultBody.error(CommonEnum.INTERNAL_SERVER_ERROR);
    }
}


