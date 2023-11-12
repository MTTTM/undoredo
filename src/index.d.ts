export interface Command {
    name: string;
    pushQueue?: boolean;
    keyboard?: string;
    execute: (...args: any[]) => {
        undo(): void;
        redo?(): void;
    },
    init?: (t: UndoRedoInterface) => () => void;
}
export interface Queue {
    undo: () => void;
    redo: () => void;
}
export interface State {
    current: number;
    readonly queue: Queue[];
    readonly commands: Record<string, (...args: any[]) => void>;
    readonly commandArray: Command[];
    readonly destroyList: (() => void)[];
}
export default class UndoRedoInterface {
    constructor(_changeFn?: () => void);
    readonly state: State;
    registry(t: Command): void;
    protected undo(): void;
    protected redo(): void;
    protected _onKeyDown(e: KeyboardEvent): void;
    protected onKeyDown(e: KeyboardEvent): void;
    protected _keyboardEvent(): void;
    destroy(): void;
    protected changeEvent?(): void;

}