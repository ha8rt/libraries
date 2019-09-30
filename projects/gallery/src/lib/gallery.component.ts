import { Component, OnInit, Input } from '@angular/core';
import { IGallery } from './gallery.handler';

@Component({
  selector: 'lib-gallery',
  template: `
    <p>
      gallery works!
    </p>
  `,
  styles: []
})
export class GalleryComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  @Input('links') links: IGallery[];
  @Input('title') title: string;

}
