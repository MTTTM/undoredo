import UndoRedoInterface, { Command, Queue } from "./index.d"
class UndoRedo extends UndoRedoInterface {

    readonly state = {
        current: -1,//前进后索引
        queue: [] as Queue[],//存放所有【操作命令】 数组对象为{undo,redo},//对应教程里面的undo，redo，只是这里我不喜欢这样叫
        commands: {} as Record<string, (...args: any[]) => void>,//命令对应函数的映射表 {undo:()=>{},redo=>{}}   执行命令时候调用1。execute函数以及2.execute返回的undo函数，请查看 注释【AAAAA】
        commandArray: [] as Command[],//存放所有命令，（比较完整的内容）
        destroyList: [] as (() => void)[],//销毁函数队列
    }
    protected undo() {
        this.registry({
            name: "undo",
            keyboard: "ctrl+y",
            execute: () => {
                return {
                    undo: () => {
                        let item = this.state.queue[this.state.current + 1];
                        //如果当前处于最后一个时候，点击undo将会无效
                        if (item) {
                            item.undo && item.undo();
                            this.state.current++;
                        }

                    }
                }
            }
        });
    }
    protected redo() {
        this.registry({
            name: "redo",
            keyboard: "ctrl+z",
            execute: () => {
                return {
                    undo: () => {
                        if (this.state.current == -1) return;
                        let item = this.state.queue[this.state.current];
                        //如果在第一个redo将会无效
                        if (item) {
                            item.redo && item.redo();
                            this.state.current--;
                        }
                    }
                }
            }
        });
    }

    constructor(changeFn?: () => void) {
        super();
        this.undo();
        this.redo();
        this.onKeyDown = this._onKeyDown.bind(this);
        this._keyboardEvent();
        this.changeEvent = changeFn
    }
    protected changeEvent?: () => void;
    protected onKeyDown: (e: KeyboardEvent) => void;
    registry(command: Command) {
        this.state.commandArray.push(command);
        this.state.commands[command.name] = (...args) => {
            const { undo, redo,...other } = command.execute(...args);
            undo();
            /**
             * demo
             * var q=[1,2,3,4]
             * var current=4;
             * redo()  curent=3
             * update() current=4
             * undo() current=4
             */
            //redo,undo commond不会进入后面的步骤
            if (command.pushQueue) {
                let { queue, current } = this.state;
                this.state.current = current + 1;
                queue.push({ undo, redo: redo!,...other });
            }
            typeof this.changeEvent === 'function' && this.changeEvent();
        }
        //@ts-ignore
        let destroy = typeof command?.init === "function" && command?.init(this);
        if (destroy) {
            this.state.destroyList.push(destroy)
        }

    }

    protected _onKeyDown(e: KeyboardEvent) {
        const { ctrlKey, keyCode } = e;
        let keyStringArray: string[] = [];
        if (ctrlKey) {
            keyStringArray.push("ctrl");
        }
        interface IStatusType {
            [key: string]: string;
        }

        const keyCodes: IStatusType = {
            90: "z",
            89: "y"
        }
        keyStringArray.push(keyCodes[keyCode] as string);
        const keyString = keyStringArray.join("+");
        //拼接字符串 ctrl+z，ctrl+y
        this.state.commandArray.forEach(({ keyboard, name }) => {
            //没有键盘事件，没有设置keyboard参数
            if (!keyboard) return;
            if (keyboard === keyString) {
                this.state.commands[name]();
                //阻止默认事件
                e.preventDefault();
            }

        })
    }
    protected _keyboardEvent() {
        window.addEventListener("keydown", this.onKeyDown);
    }
    destroy() {
        this.state.destroyList.forEach(item => item());
        window.removeEventListener("keydown", this.onKeyDown)
    }

}

export default UndoRedo;