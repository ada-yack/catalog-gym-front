import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.html',
  styleUrls: ['./home.css', './carousel.css']
})
export class Home implements OnInit, OnDestroy {

  currentSlide = 0;

  totalSlides = 3;

  autoplay?: ReturnType<typeof setInterval>;

  ngOnInit(): void {
    this.startAutoplay();
  }

  ngOnDestroy(): void {
  if (this.autoplay) {
    clearInterval(this.autoplay);
  }
  }
  nextSlide(): void {
    this.currentSlide = (this.currentSlide + 1) % this.totalSlides;
  }

  prevSlide(): void {
    this.currentSlide =
      (this.currentSlide - 1 + this.totalSlides) % this.totalSlides;
  }

  goToSlide(index: number): void {
    this.currentSlide = index;
  }

  startAutoplay(): void {
    this.autoplay = setInterval(() => {
      this.nextSlide();
    }, 5000);
  }

  restartAutoplay(): void {
  if (this.autoplay) {
    clearInterval(this.autoplay);
  }
  this.startAutoplay();
}
 

}