import { Plugin } from 'prosemirror-state';
import type { EditorView } from 'prosemirror-view';
import * as Y from 'yjs';
import {
    absolutePositionToRelativePosition,
    relativePositionToAbsolutePosition,
    ySyncPluginKey,
} from 'y-prosemirror';

interface SyncPluginState {
    doc: Y.Doc;
    type: Y.XmlFragment;
    binding: {
        mapping: Map<unknown, { nodeSize: number }>;
    };
}

interface AwarenessLike {
    getLocalState: () => Record<string, unknown> | null;
    setLocalStateField: (field: string, value: unknown) => void;
}

interface AwarenessCursorState {
    anchor: unknown;
    head: unknown;
}

function getSyncState(view: EditorView): SyncPluginState | null {
    const state = ySyncPluginKey.getState(view.state) as SyncPluginState | null;
    if (!state || !state.binding) {
        return null;
    }
    return state;
}

function isSameCursor(current: AwarenessCursorState | null, anchor: Y.RelativePosition, head: Y.RelativePosition) {
    if (!current) {
        return false;
    }

    try {
        return (
            Y.compareRelativePositions(Y.createRelativePositionFromJSON(current.anchor), anchor) &&
            Y.compareRelativePositions(Y.createRelativePositionFromJSON(current.head), head)
        );
    } catch {
        return false;
    }
}

export function createLocalCursorAwarenessPlugin(awareness: AwarenessLike, cursorStateField = 'cursor') {
    return new Plugin({
        view(view) {
            const updateLocalCursor = () => {
                const syncState = getSyncState(view);
                if (!syncState || syncState.binding.mapping.size === 0) {
                    return;
                }

                const currentState = (awareness.getLocalState() ?? {}) as Record<string, unknown>;
                const currentCursor = (currentState[cursorStateField] ?? null) as AwarenessCursorState | null;

                if (view.hasFocus()) {
                    const { anchor: anchorPos, head: headPos } = view.state.selection;
                    const anchor = absolutePositionToRelativePosition(
                        anchorPos,
                        syncState.type,
                        syncState.binding.mapping as any,
                    );
                    const head = absolutePositionToRelativePosition(
                        headPos,
                        syncState.type,
                        syncState.binding.mapping as any,
                    );

                    if (!isSameCursor(currentCursor, anchor, head)) {
                        awareness.setLocalStateField(cursorStateField, { anchor, head });
                    }
                    return;
                }

                if (!currentCursor) {
                    return;
                }

                try {
                    const absoluteAnchor = relativePositionToAbsolutePosition(
                        syncState.doc,
                        syncState.type,
                        Y.createRelativePositionFromJSON(currentCursor.anchor),
                        syncState.binding.mapping as any,
                    );

                    if (absoluteAnchor !== null) {
                        awareness.setLocalStateField(cursorStateField, null);
                    }
                } catch {
                    awareness.setLocalStateField(cursorStateField, null);
                }
            };

            view.dom.addEventListener('focusin', updateLocalCursor);
            view.dom.addEventListener('focusout', updateLocalCursor);

            return {
                update: updateLocalCursor,
                destroy: () => {
                    view.dom.removeEventListener('focusin', updateLocalCursor);
                    view.dom.removeEventListener('focusout', updateLocalCursor);
                    awareness.setLocalStateField(cursorStateField, null);
                },
            };
        },
    });
}
