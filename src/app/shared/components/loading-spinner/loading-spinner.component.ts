import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="containerClass">
      <div [class]="spinnerClass"></div>
      <p *ngIf="message" [class]="messageClass">{{ message }}</p>
    </div>
  `
})
export class LoadingSpinnerComponent {
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() message?: string;
  @Input() center = true;

  get containerClass(): string {
    const baseClass = this.center ? 'flex flex-col items-center justify-center' : 'flex items-center';
    return `${baseClass} ${this.center ? 'min-h-32' : ''}`;
  }

  get spinnerClass(): string {
    const sizeClasses = {
      'sm': 'h-4 w-4',
      'md': 'h-8 w-8',
      'lg': 'h-12 w-12'
    };
    
    return `animate-spin rounded-full border-2 border-gray-300 border-t-primary-600 ${sizeClasses[this.size]}`;
  }

  get messageClass(): string {
    return 'mt-2 text-sm text-gray-600';
  }
}