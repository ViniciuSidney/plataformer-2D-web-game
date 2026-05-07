export class InputSystem {
  constructor() {
    this.keys = {
      left: false,
      right: false,
      jump: false,
      restart: false,
      start: false,
      pause: false,
      next: false,
      menu: false,

      previousLevel: false,
      nextLevelEdit: false,
    };

    this.bindEvents();
  }

  bindEvents() {
    window.addEventListener("keydown", (event) => {
      this.handleKey(event.code, event.key, true);
    });

    window.addEventListener("keyup", (event) => {
      this.handleKey(event.code, event.key, false);
    });
  }

  handleKey(code, key, isPressed) {
    const codeMap = {
      ArrowLeft: "left",
      KeyA: "left",

      ArrowRight: "right",
      KeyD: "right",

      Space: "jump",
      ArrowUp: "jump",
      KeyW: "jump",

      KeyR: "restart",
      Enter: "start",
      Escape: "pause",
      KeyN: "next",
      KeyM: "menu",

      Comma: "previousLevel",
      Period: "nextLevelEdit",
    };

    const keyMap = {
      ",": "previousLevel",
      ".": "nextLevelEdit",
    };

    const action = codeMap[code] || keyMap[key];

    if (action) {
      this.keys[action] = isPressed;
    }
  }
  isPressed(action) {
    return Boolean(this.keys[action]);
  }
}
