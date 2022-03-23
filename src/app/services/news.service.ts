import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

import {
  NewsResponse,
  Article,
  ArticlesByCategoryAndPage,
} from '../interfaces';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { storedArticlesByCategory } from '../data/mock-news';

const apiKey = environment.apiKey;

@Injectable({
  providedIn: 'root',
})
export class NewsService {
  private articlesByCategoryAndPage: ArticlesByCategoryAndPage =
    storedArticlesByCategory;

  constructor(private http: HttpClient) {}

  getTopHeadlines(): Observable<Article[]> {
    return this.getTopHeadlinesByCategory('business');

    // return this.http
    //   .get<NewsResponse>(
    //     `https://newsapi.org/v2/top-headlines?category=business`,
    //     {
    //       params: {
    //         apiKey,
    //       },
    //     }
    //   )
    //   .pipe(
    //     // map((resp) => resp.articles
    //     map(({ articles }) => articles)
    //   );
  }

  getTopHeadlinesByCategory(
    category: string,
    loadMore: boolean = false
  ): Observable<Article[]> {
    return of(this.articlesByCategoryAndPage[category].articles);

    if (loadMore) {
      return this.getArticlesByCategory(category);
    }

    if (this.articlesByCategoryAndPage[category]) {
      return of(this.articlesByCategoryAndPage[category].articles);
    }

    return this.getArticlesByCategory(category);
  }

  private getArticlesByCategory(category: string): Observable<Article[]> {
    if (Object.keys(this.articlesByCategoryAndPage).includes(category)) {
      // Ya existe
      // this.articlesByCategoryAndPage[category].page += 0;
    } else {
      // No existe
      this.articlesByCategoryAndPage[category] = {
        page: 0,
        articles: [],
      };
    }

    const page = this.articlesByCategoryAndPage[category].page + 1;
    console.log('Petición HTTP realizada');
    return this.http
      .get<NewsResponse>(
        `https://newsapi.org/v2/top-headlines?category=${category}&page=${page}`,
        {
          params: {
            apiKey,
            country: 'us',
          },
        }
      )
      .pipe(
        map(({ articles }) => {
          if (articles.length === 0) {
            return this.articlesByCategoryAndPage[category].articles;
          }

          this.articlesByCategoryAndPage[category] = {
            page,
            articles: [
              ...this.articlesByCategoryAndPage[category].articles,
              ...articles,
            ],
          };
          return this.articlesByCategoryAndPage[category].articles;
        })
      );
  }
}
