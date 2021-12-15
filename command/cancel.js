const ball = document.getElementById('ball');
const pos = document.getElementById('pos');
const moveBtn = document.getElementById('moveBtn');

class MoveCommand {
    constructor(receiver, pos, oldPos) {
        this.receiver = receiver;
        this.pos = pos;
        this.oldPos = oldPos;
    }
    execute() {
        this.receiver.start('left', this.pos, 1000, 'strongOut');
        this.oldPos = this.receiver.dom.getBoundingClientRect()[ this.receiver.propertyName ];
    }
    undo() {
        this.receiver.start(/** some args */)
    }
}
const moveCommand;
moveBtn.onclick = function() {
    let animate = new this.animate(ball);
    moveCommand = new MoveCommand(animate, pos.value);
    moveCommand.execute();
}

// add cancel btn

