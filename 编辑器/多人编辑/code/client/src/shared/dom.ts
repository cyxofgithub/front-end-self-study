export interface AppDomNodes {
    editorRoot: HTMLElement;
    statusIndicator: HTMLElement;
    statusText: HTMLElement;
    userList: HTMLElement;
    toolbar: HTMLElement;
}

function requireElement(id: string): HTMLElement {
    const element = document.getElementById(id);
    if (!element) {
        throw new Error(`页面缺少必要 DOM 节点：${id}`);
    }
    return element;
}

export function getAppDomNodes(): AppDomNodes {
    return {
        editorRoot: requireElement('editor'),
        statusIndicator: requireElement('statusIndicator'),
        statusText: requireElement('statusText'),
        userList: requireElement('userList'),
        toolbar: requireElement('editorToolbar'),
    };
}
