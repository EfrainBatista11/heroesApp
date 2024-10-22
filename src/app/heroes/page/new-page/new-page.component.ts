import { Component } from '@angular/core';

@Component({
  selector: 'app-new-page',
  templateUrl: './new-page.component.html',
  styles: ``,
})
export class NewPageComponent {
  // quemado, se debe buscar al backend
  public publishers = [
    { id: 'DC Comics', desc: 'DC - Comics' }, // desc es la descripción
    { id: 'Marvel Comics', desc: 'Marvel - Comics' },
  ];
}
