import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Importante para o Angular moderno
import { NewsService } from '../../core/services/news';
import { StorageService } from '../../core/services/storage';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class HomeComponent implements OnInit {
  articles: any[] = [];
  categories: string[] = ['general', 'technology', 'sports', 'entertainment', 'business'];
  activeCategory: string = 'general';

  constructor(private newsService: NewsService, private storageService: StorageService) {}

  ngOnInit(): void {
    this.loadNews();
  }

  loadNews(): void {
    this.newsService.getTopHeadlines(this.activeCategory).subscribe(response => {
      this.articles = response.articles || [];
    });
  }

  selectCategory(category: string): void {
    this.activeCategory = category;
    this.loadNews();
  }

  toggleFav(article: any): void {
    this.storageService.toggleFavorite(article);
  }

  isFavorite(url: string): boolean {
    return this.storageService.isFavorite(url);
  }
}