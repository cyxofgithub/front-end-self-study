import { toggleMark } from 'prosemirror-commands';
import type { Schema } from 'prosemirror-model';
import type { EditorState, Transaction } from 'prosemirror-state';
import {
    addColumnAfter,
    addRowAfter,
    deleteColumn,
    deleteRow,
} from 'prosemirror-tables';

export type EditorCommand = (
    state: EditorState,
    dispatch?: (tr: Transaction) => void
) => boolean;

export type CommandName =
    | 'toggleBold'
    | 'toggleItalic'
    | 'toggleUnderline'
    | 'toggleStrike'
    | 'insertTable'
    | 'addRow'
    | 'deleteRow'
    | 'addColumn'
    | 'deleteColumn';

// 插入表格命令手动构建 ProseMirror 节点树，再替换当前选区。
function createInsertTableCommand(rows = 3, cols = 3): EditorCommand {
    return (state, dispatch) => {
        const tableType = state.schema.nodes.table;
        const tableRowType = state.schema.nodes.table_row;
        const tableCellType = state.schema.nodes.table_cell;
        const paragraphType = state.schema.nodes.paragraph;

        if (!tableType || !tableRowType || !tableCellType || !paragraphType) {
            return false;
        }

        const rowNodes = Array.from({ length: rows }, () => {
            const cellNodes = Array.from({ length: cols }, () =>
                tableCellType.createChecked(null, paragraphType.createChecked())
            );
            return tableRowType.createChecked(null, cellNodes);
        });

        const table = tableType.createChecked(null, rowNodes);
        if (dispatch) {
            dispatch(state.tr.replaceSelectionWith(table).scrollIntoView());
        }
        return true;
    };
}

export function createCommandRegistry(schema: Schema): Record<CommandName, EditorCommand> {
    // 统一命令注册表：工具栏只依赖命令名，不关心底层是 mark 命令还是 table 命令。
    return {
        toggleBold: toggleMark(schema.marks.strong),
        toggleItalic: toggleMark(schema.marks.em),
        toggleUnderline: toggleMark(schema.marks.underline),
        toggleStrike: toggleMark(schema.marks.strike),
        insertTable: createInsertTableCommand(),
        addRow: addRowAfter,
        deleteRow,
        addColumn: addColumnAfter,
        deleteColumn,
    };
}
