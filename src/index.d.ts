export interface Command {
    name: string;
    pushQueue?: boolean;
    keyboard?:string;
    execute: (...args: any[]) => {
        undo():void;
        redo?():void;
    },
    init?: (t:UndoRedoInterface) => () => void;
}
export interface Queue {
    undo: () => void;
    redo: () => void;
}
export interface State {
    current: number;
   readonly queue: Queue[];
   readonly commands: Record<string, (...args: any[]) => void>;
   readonly  commandArray: Command[];
    readonly destroyList: (()=>void)[];
}
export interface UndoRedoInterface {
   readonly  state:State;
  readonly   registry: (t: Command) => void;
  readonly   undo: () => void;
  readonly   redo: () => void;
  readonly   _onKeyDown: (e: KeyboardEvent) => void;
 readonly    onKeyDown: (e: KeyboardEvent) => void;
 readonly    _keyboardEvent: () => void;
  readonly   destroy: () => void;
    changeEvent?: () => void;
}