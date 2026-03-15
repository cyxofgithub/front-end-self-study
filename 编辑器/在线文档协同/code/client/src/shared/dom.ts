export interface AppDomNodes {
    editorRoot: HTMLElement;
    editorWrapper: HTMLElement;
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

function requireSelector(selector: string): HTMLElement {
    const element = document.querySelector<HTMLElement>(selector);
    if (!element) {
        throw new Error(`页面缺少必要 DOM 节点：${selector}`);
    }
    return element;
}

export function getAppDomNodes(): AppDomNodes {
    return {
        editorRoot: requireElement('editor'),
        editorWrapper: requireSelector('.editor-wrapper'),
        statusIndicator: requireElement('statusIndicator'),
        statusText: requireElement('statusText'),
        userList: requireElement('userList'),
        toolbar: requireElement('editorToolbar'),
    };
}
