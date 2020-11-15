var eventsManager = {
    bind: [],
    action: [],
    setup: function (canvas) {
        this.bind[87]="up";
        document.addEventListener("touchstart", physicManager.jump);
        document.addEventListener("mousedown", physicManager.jump);
        document.addEventListener("keydown", (event) => {
            if (event.keyCode === 32)
                physicManager.jump();
        });
    },
}