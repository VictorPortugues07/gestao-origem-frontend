import { Component, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  title = 'Gestão Origem';

  menuAberto = signal(false);

  constructor(router: Router) {
    router.events
      .pipe(filter((evento) => evento instanceof NavigationEnd))
      .subscribe(() => this.menuAberto.set(false));
  }

  alternarMenu(): void {
    this.menuAberto.update((aberto) => !aberto);
    this.atualizarScrollDoBody();
  }

  fecharMenu(): void {
    this.menuAberto.set(false);
    this.atualizarScrollDoBody();
  }

  private atualizarScrollDoBody(): void {
    document.body.style.overflow = this.menuAberto() ? 'hidden' : '';
  }
}
