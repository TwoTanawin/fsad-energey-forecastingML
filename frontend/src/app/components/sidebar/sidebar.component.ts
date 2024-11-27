import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {

  constructor(private router: Router) {}

  navigation = [
    { name: 'Home', icon: 'home', href: '/map', current: true },
    { name: 'Dashboard', icon: 'dashboard', href: '/dashboard', current: false },
    { name: 'Community', icon: 'community', href: '/post', current: false },
    { name: 'Saved Posts', icon: 'bookmark', href: '/saved-post', current: false },
  ];

  topics = [
    { name: 'Weight Training', initial: 'W' },
    { name: 'Running', initial: 'R' },
    { name: 'Protein', initial: 'P' },
  ];

  newTopicName = ''; // Hold the new topic name
  isEditing = false; // To track editing mode
  editingTopicIndex: number | null = null; // To hold the index of the topic being edited
  editingTopicName = ''; // To hold the new name while editing
  showOptionsIndex: number | null = null; // <-- Declare this property to track which topic options are visible

  classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ');
  }

  // Add a new topic
  addTopic() {
    if (this.newTopicName.trim()) {
      const newInitial = this.newTopicName.charAt(0).toUpperCase();
      this.topics.push({ name: this.newTopicName, initial: newInitial });
      this.newTopicName = ''; // Clear input after adding
    }
  }

  // Delete a topic
  deleteTopic(index: number) {
    this.topics.splice(index, 1); // Remove the topic at the given index
  }

  // Enable edit mode for a topic
  enableEditTopic(index: number) {
    this.isEditing = true;
    this.editingTopicIndex = index;
    this.editingTopicName = this.topics[index].name; // Set current name in input
    this.showOptionsIndex = null; // Close options after editing
  }

  // Save the edited topic
  saveEditTopic() {
    if (this.editingTopicName.trim() && this.editingTopicIndex !== null) {
      const newInitial = this.editingTopicName.charAt(0).toUpperCase();
      this.topics[this.editingTopicIndex] = { 
        name: this.editingTopicName, 
        initial: newInitial 
      };
      this.cancelEdit(); // Exit edit mode after saving
    }
  }

  // Cancel editing
  cancelEdit() {
    this.isEditing = false;
    this.editingTopicIndex = null;
    this.editingTopicName = '';
  }

  // Toggle options display for a specific topic
  toggleOptions(index: number) {
    this.showOptionsIndex = this.showOptionsIndex === index ? null : index;
  }

  isActive(route: string): boolean {
    return this.router.url === route;
  }
}
