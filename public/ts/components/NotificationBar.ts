export enum NotificationLevel {
  primary = 'primary',
  link = 'link',
  info = 'info',
  success = 'success',
  warning = 'warning',
  danger = 'danger',
}

export class NotificationBar extends HTMLElement {
  private message: string = '';

  constructor() {
    super();

    this.classList.add('notification', 'is-invisible', 'is-pulled-right');
  }

  public hide() {
    this.classList.add('is-invisible');
  }

  public show(message: string, level: NotificationLevel) {
    this.message = message;
    // clear any other classes - reset
    this.className = `notification is-${level} is-pulled-right`;
    this.render();
  }

  public connectedCallback() {
    this.render();
  }

  private onDeleteClick(event: Event) {
    event.preventDefault();

    this.hide();
    return false;
  }

  private render() {
    this.innerHTML = `<button class="delete"></button>${this.message || ''}`;
    const elDelete = this.querySelector('.delete');

    // this should always be true, but keep TS happy
    if (elDelete) {
      elDelete.addEventListener('click', this.onDeleteClick.bind(this));
    }
  }
}
