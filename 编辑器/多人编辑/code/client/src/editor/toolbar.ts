import type { EditorState } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import type { CommandName, EditorCommand } from './commands';

type MarkName = 'strong' | 'em' | 'underline' | 'strike';

function isMarkActive(state: EditorState, markName: MarkName) {
    const markType = state.schema.marks[markName];
    if (!markType) {
        return false;
    }

    const { from, $from, to, empty } = state.selection;
    if (empty) {
        // 光标态：看 storedMarks（即将输入的样式）或当前位置已有样式。
        return !!markType.isInSet(state.storedMarks || $from.marks());
    }

    // 选区态：判断所选范围内是否包含该 mark。
    return state.doc.rangeHasMark(from, to, markType);
}

export interface ToolbarController {
    updateToolbarState: () => void;
    destroy: () => void;
}

interface CreateToolbarControllerOptions {
    toolbar: HTMLElement;
    getView: () => EditorView;
    commandRegistry: Record<CommandName, EditorCommand>;
}

export function createToolbarController({
    toolbar,
    getView,
    commandRegistry,
}: CreateToolbarControllerOptions): ToolbarController {
    const toolbarButtons = Array.from(
        toolbar.querySelectorAll<HTMLButtonElement>('[data-command]')
    );

    const updateToolbarState = () => {
        const view = getView();

        toolbarButtons.forEach((button) => {
            const commandName = button.dataset.command as CommandName | undefined;
            if (!commandName) {
                return;
            }

            const command = commandRegistry[commandName];
            // 不传 dispatch 仅做“可执行性探测”，用于按钮启用/禁用显示。
            const isEnabled = command ? command(view.state) : false;
            button.disabled = !isEnabled;
            button.classList.toggle('disabled', !isEnabled);
        });

        // active 态只针对文本样式按钮，表示当前选区的实际格式状态。
        toolbarButtons.forEach((button) => button.classList.remove('active'));
        toolbar
            .querySelector<HTMLButtonElement>('[data-command="toggleBold"]')
            ?.classList.toggle('active', isMarkActive(view.state, 'strong'));
        toolbar
            .querySelector<HTMLButtonElement>('[data-command="toggleItalic"]')
            ?.classList.toggle('active', isMarkActive(view.state, 'em'));
        toolbar
            .querySelector<HTMLButtonElement>('[data-command="toggleUnderline"]')
            ?.classList.toggle('active', isMarkActive(view.state, 'underline'));
        toolbar
            .querySelector<HTMLButtonElement>('[data-command="toggleStrike"]')
            ?.classList.toggle('active', isMarkActive(view.state, 'strike'));
    };

    const onToolbarClick = (event: Event) => {
        const target = event.target;
        if (!(target instanceof HTMLElement)) {
            return;
        }

        const button = target.closest<HTMLButtonElement>('button[data-command]');
        if (!button) {
            return;
        }

        const commandName = button.dataset.command as CommandName | undefined;
        if (!commandName) {
            return;
        }

        const command = commandRegistry[commandName];
        if (!command) {
            return;
        }

        const view = getView();
        const didRun = command(view.state, view.dispatch);
        if (didRun) {
            // 执行命令后把焦点还给编辑器，方便连续输入。
            view.focus();
        }
        // 无论命令是否执行，都刷新一次按钮状态，避免 UI 与实际状态不同步。
        updateToolbarState();
    };

    toolbar.addEventListener('click', onToolbarClick);

    return {
        updateToolbarState,
        destroy: () => {
            toolbar.removeEventListener('click', onToolbarClick);
        },
    };
}
