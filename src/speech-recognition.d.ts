declare global {
    interface Window {
      SpeechRecognition: typeof SpeechRecognition;
      webkitSpeechRecognition: typeof webkitSpeechRecognition;
    }
  
    interface SpeechRecognitionEvent extends Event {
      results: SpeechRecognitionResultList;
      interpretation: any;
      isFinal: boolean;
    }
  }
  
  // This is needed to mark this file as a module.
  export {};
  