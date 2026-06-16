import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  setCache(key: string, data: any): void {
    localStorage.setItem(key, JSON.stringify({
      data,
      timestamp: new Date().getTime()
    }));
  }

  getCache(key: string): any {
    const cached = localStorage.getItem(key);
    if (!cached) return null;
    
    const parsed = JSON.parse(cached);
    const isExpired = (new Date().getTime() - parsed.timestamp) > 30 * 60 * 1000; // Expira em 30 min
    
    if (isExpired) {
      localStorage.removeItem(key);
      return null;
    }
    return parsed.data;
  }

  getFavorites(): any[] {
    const favs = localStorage.getItem('favorites');
    return favs ? JSON.parse(favs) : [];
  }

  toggleFavorite(article: any): void {
    let favs = this.getFavorites();
    const index = favs.findIndex(f => f.url === article.url);

    if (index >= 0) {
      favs.splice(index, 1);
    } else {
      favs.push(article);
    }
    localStorage.setItem('favorites', JSON.stringify(favs));
  }

  isFavorite(articleUrl: string): boolean {
    return this.getFavorites().some(f => f.url === articleUrl);
  }
}