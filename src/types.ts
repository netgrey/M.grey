export interface ChatMessage {
  id: string;
  sender: 'user' | 'mentor';
  text: string;
  timestamp: string;
}

export interface AssessmentQuestion {
  id: number;
  text: string;
  category: 'autonomy' | 'restructuring' | 'performance';
  options: {
    text: string;
    score: number;
  }[];
}

export interface AssessmentResult {
  scores: {
    autonomy: number; // 0 to 100
    restructuring: number; // 0 to 100
    performance: number; // 0 to 100
  };
  archetype: string;
  feedback: string;
  date: string;
}

export interface ActionItem {
  id: string;
  text: string;
  category: 'autonomy' | 'restructuring' | 'performance';
  completed: boolean;
  dueDate: string;
  createdAt: string;
}

export interface MindsetPattern {
  id: string;
  limitingLoop: string;
  restructuredBehavior: string;
  detectedOn: string;
}
