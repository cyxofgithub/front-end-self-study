import { MarkSpec, Schema } from 'prosemirror-model';
import { schema as basicSchema } from 'prosemirror-schema-basic';
import { tableNodes } from 'prosemirror-tables';

const underlineMarkSpec: MarkSpec = {
    parseDOM: [
        { tag: 'u' },
        {
            style: 'text-decoration',
            getAttrs: (value) =>
                typeof value === 'string' && value.includes('underline') ? null : false,
        },
    ],
    toDOM: () => ['u', 0],
};

const strikeMarkSpec: MarkSpec = {
    parseDOM: [
        { tag: 's' },
        { tag: 'del' },
        { tag: 'strike' },
        {
            style: 'text-decoration',
            getAttrs: (value) =>
                typeof value === 'string' && value.includes('line-through') ? null : false,
        },
    ],
    toDOM: () => ['s', 0],
};

// 以基础 schema 为底座扩展：
// 1) 追加 table 节点支持结构化编辑；2) 补充 underline/strike mark 对应工具栏能力。
export const proseMirrorSchema: Schema = new Schema({
    nodes: basicSchema.spec.nodes.append(
        tableNodes({
            tableGroup: 'block',
            cellContent: 'block+',
            cellAttributes: {},
        })
    ),
    marks: basicSchema.spec.marks
        .addToEnd('underline', underlineMarkSpec)
        .addToEnd('strike', strikeMarkSpec),
});
