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
      };

      this.bindEvents();
   }

   bindEvents() {
      window.addEventListener('keydown', (event) => {
         this.handleKey(event.code, true);
      });

      window.addEventListener('keyup', (event) => {
         this.handleKey(event.code, false);
      });
   }

   handleKey(code, isPressed) {
      const keyMap = {
         ArrowLeft: 'left',
         KeyA: 'left',

         ArrowRight: 'right',
         KeyD: 'right',

         Space: 'jump',
         ArrowUp: 'jump',
         KeyW: 'jump',

         KeyR: 'restart',
         Enter: 'start',
         Escape: 'pause',

         KeyN: 'next',
      };

      const action = keyMap[code];

      if (action) {
         this.keys[action] = isPressed;
      }
   }

   isPressed(action) {
      return Boolean(this.keys[action]);
   }
}
