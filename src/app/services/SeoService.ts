import { Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Injectable({ providedIn: 'root' })
export class SeoService {
  constructor(private meta: Meta, private title: Title) {}

  /**
   * Met à jour le title et toutes les meta tags SEO importantes.
   * @param pageTitle Titre complet de la page
   * @param description Description courte pour la page
   * @param keywords Mots-clés SEO séparés par des virgules
   * @param url URL canonique de la page (ex: https://kanji-arena.com/page)
   * @param imageUrl URL de l’image pour Open Graph / Twitter Cards
   * @param author Auteur du site (optionnel)
   * @param robots Directive robots (optionnel, par défaut 'index, follow')
   */
  updateHeadTags(
    pageTitle: string,
    description: string,
    keywords: string,
    url: string,
    imageUrl: string,
    author: string = 'Yonni',
    robots: string = 'index, follow'
  ): void {
    // Titre de la page
    if (pageTitle) {
      this.title.setTitle(pageTitle);
    }

    // Meta tags Générales
    this.meta.updateTag({ name: 'description', content: description || '' });
    this.meta.updateTag({ name: 'keywords', content: keywords || '' });
    this.meta.updateTag({ name: 'robots', content: robots });
    this.meta.updateTag({ name: 'author', content: author });

    // Open Graph
    this.meta.updateTag({ property: 'og:title', content: pageTitle || '' });
    this.meta.updateTag({
      property: 'og:description',
      content: description || '',
    });
    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ property: 'og:url', content: url || '' });
    this.meta.updateTag({ property: 'og:image', content: imageUrl || '' });

    // Twitter Cards
    this.meta.updateTag({
      name: 'twitter:card',
      content: 'summary_large_image',
    });
    this.meta.updateTag({ name: 'twitter:title', content: pageTitle || '' });
    this.meta.updateTag({
      name: 'twitter:description',
      content: description || '',
    });
    this.meta.updateTag({ name: 'twitter:image', content: imageUrl || '' });
  }
}
