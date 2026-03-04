export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      feature_notifications: {
        Row: {
          id: string
          user_id: string
          feature: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          feature: string
          created_at?: string
        }
        Update: {
          user_id?: string
          feature?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          id: string
          full_name: string | null
          avatar_url: string | null
          target_band_score: number | null
          telegram_id: number | null
          phone: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          avatar_url?: string | null
          target_band_score?: number | null
          telegram_id?: number | null
          phone?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string | null
          avatar_url?: string | null
          target_band_score?: number | null
          telegram_id?: number | null
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      telegram_auth_codes: {
        Row: {
          id: string
          code: string
          telegram_id: number
          first_name: string | null
          last_name: string | null
          username: string | null
          phone: string | null
          photo_url: string | null
          used: boolean
          expires_at: string
          created_at: string
        }
        Insert: {
          id?: string
          code: string
          telegram_id: number
          first_name?: string | null
          last_name?: string | null
          username?: string | null
          phone?: string | null
          photo_url?: string | null
          used?: boolean
          expires_at: string
          created_at?: string
        }
        Update: {
          code?: string
          telegram_id?: number
          first_name?: string | null
          last_name?: string | null
          username?: string | null
          phone?: string | null
          photo_url?: string | null
          used?: boolean
          expires_at?: string
        }
        Relationships: []
      }
      tests: {
        Row: {
          id: string
          title: string
          description: string | null
          difficulty_level: 'easy' | 'medium' | 'hard' | null
          is_published: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          difficulty_level?: 'easy' | 'medium' | 'hard' | null
          is_published?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          title?: string
          description?: string | null
          difficulty_level?: 'easy' | 'medium' | 'hard' | null
          is_published?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      listening_sections: {
        Row: {
          id: string
          test_id: string
          section_number: number
          audio_url: string
          audio_duration_seconds: number | null
          transcript: string | null
          created_at: string
        }
        Insert: {
          id?: string
          test_id: string
          section_number: number
          audio_url: string
          audio_duration_seconds?: number | null
          transcript?: string | null
          created_at?: string
        }
        Update: {
          test_id?: string
          section_number?: number
          audio_url?: string
          audio_duration_seconds?: number | null
          transcript?: string | null
        }
        Relationships: []
      }
      reading_passages: {
        Row: {
          id: string
          test_id: string
          passage_number: number
          title: string
          content: string
          word_count: number | null
          created_at: string
        }
        Insert: {
          id?: string
          test_id: string
          passage_number: number
          title: string
          content: string
          word_count?: number | null
          created_at?: string
        }
        Update: {
          test_id?: string
          passage_number?: number
          title?: string
          content?: string
          word_count?: number | null
        }
        Relationships: []
      }
      speaking_topics: {
        Row: {
          id: string
          test_id: string
          part_number: number
          topic: string
          questions: Json | null
          preparation_time_seconds: number
          speaking_time_seconds: number
          created_at: string
        }
        Insert: {
          id?: string
          test_id: string
          part_number: number
          topic: string
          questions?: Json | null
          preparation_time_seconds?: number
          speaking_time_seconds?: number
          created_at?: string
        }
        Update: {
          test_id?: string
          part_number?: number
          topic?: string
          questions?: Json | null
          preparation_time_seconds?: number
          speaking_time_seconds?: number
        }
        Relationships: []
      }
      writing_tasks: {
        Row: {
          id: string
          test_id: string
          task_number: number
          task_type: string | null
          prompt: string
          image_url: string | null
          min_words: number
          sample_answer: string | null
          created_at: string
        }
        Insert: {
          id?: string
          test_id: string
          task_number: number
          task_type?: string | null
          prompt: string
          image_url?: string | null
          min_words: number
          sample_answer?: string | null
          created_at?: string
        }
        Update: {
          test_id?: string
          task_number?: number
          task_type?: string | null
          prompt?: string
          image_url?: string | null
          min_words?: number
          sample_answer?: string | null
        }
        Relationships: []
      }
      questions: {
        Row: {
          id: string
          module_type: 'listening' | 'reading'
          section_id: string
          question_number: number
          question_type: 'tfng' | 'mcq_single' | 'mcq_multiple' | 'gap_fill' | 'matching_headings' | 'matching_info' | 'summary_completion' | 'short_answer'
          question_text: string
          options: Json | null
          correct_answer: string
          explanation: string | null
          points: number
          metadata: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          module_type: 'listening' | 'reading'
          section_id: string
          question_number: number
          question_type: 'tfng' | 'mcq_single' | 'mcq_multiple' | 'gap_fill' | 'matching_headings' | 'matching_info' | 'summary_completion' | 'short_answer'
          question_text: string
          options?: Json | null
          correct_answer: string
          explanation?: string | null
          points?: number
          metadata?: Json | null
          created_at?: string
        }
        Update: {
          module_type?: 'listening' | 'reading'
          section_id?: string
          question_number?: number
          question_type?: 'tfng' | 'mcq_single' | 'gap_fill' | 'matching_headings' | 'matching_info' | 'summary_completion' | 'short_answer'
          question_text?: string
          options?: Json | null
          correct_answer?: string
          explanation?: string | null
          points?: number
          metadata?: Json | null
        }
        Relationships: []
      }
      test_attempts: {
        Row: {
          id: string
          user_id: string
          test_id: string
          module_type: 'listening' | 'reading' | 'writing' | 'full'
          status: 'in_progress' | 'completed' | 'abandoned'
          started_at: string
          completed_at: string | null
          time_spent_seconds: number | null
          raw_score: number | null
          band_score: number | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          test_id: string
          module_type: 'listening' | 'reading' | 'writing' | 'full'
          status?: 'in_progress' | 'completed' | 'abandoned'
          started_at?: string
          completed_at?: string | null
          time_spent_seconds?: number | null
          raw_score?: number | null
          band_score?: number | null
          created_at?: string
        }
        Update: {
          user_id?: string
          test_id?: string
          module_type?: 'listening' | 'reading' | 'writing' | 'full'
          status?: 'in_progress' | 'completed' | 'abandoned'
          completed_at?: string | null
          time_spent_seconds?: number | null
          raw_score?: number | null
          band_score?: number | null
        }
        Relationships: []
      }
      user_answers: {
        Row: {
          id: string
          attempt_id: string
          question_id: string
          user_answer: string | null
          is_correct: boolean | null
          points_earned: number
          answered_at: string
        }
        Insert: {
          id?: string
          attempt_id: string
          question_id: string
          user_answer?: string | null
          is_correct?: boolean | null
          points_earned?: number
          answered_at?: string
        }
        Update: {
          attempt_id?: string
          question_id?: string
          user_answer?: string | null
          is_correct?: boolean | null
          points_earned?: number
          answered_at?: string
        }
        Relationships: []
      }
      writing_submissions: {
        Row: {
          id: string
          attempt_id: string
          task_id: string
          content: string
          word_count: number | null
          task_achievement_score: number | null
          coherence_score: number | null
          lexical_score: number | null
          grammar_score: number | null
          overall_band_score: number | null
          feedback: string | null
          submitted_at: string
        }
        Insert: {
          id?: string
          attempt_id: string
          task_id: string
          content: string
          word_count?: number | null
          task_achievement_score?: number | null
          coherence_score?: number | null
          lexical_score?: number | null
          grammar_score?: number | null
          overall_band_score?: number | null
          feedback?: string | null
          submitted_at?: string
        }
        Update: {
          attempt_id?: string
          task_id?: string
          content?: string
          word_count?: number | null
          task_achievement_score?: number | null
          coherence_score?: number | null
          lexical_score?: number | null
          grammar_score?: number | null
          overall_band_score?: number | null
          feedback?: string | null
          submitted_at?: string
        }
        Relationships: []
      }
      test_progress: {
        Row: {
          id: string
          attempt_id: string
          current_section: number | null
          current_question: number | null
          time_remaining_seconds: number | null
          answers_snapshot: Json | null
          updated_at: string
        }
        Insert: {
          id?: string
          attempt_id: string
          current_section?: number | null
          current_question?: number | null
          time_remaining_seconds?: number | null
          answers_snapshot?: Json | null
          updated_at?: string
        }
        Update: {
          attempt_id?: string
          current_section?: number | null
          current_question?: number | null
          time_remaining_seconds?: number | null
          answers_snapshot?: Json | null
          updated_at?: string
        }
        Relationships: []
      }
      full_mock_test_attempts: {
        Row: {
          id: string
          user_id: string
          test_id: string
          status: 'in_progress' | 'completed' | 'abandoned'
          started_at: string
          completed_at: string | null
          listening_score: number | null
          reading_score: number | null
          writing_score: number | null
          speaking_score: number | null
          overall_band_score: number | null
          time_spent_seconds: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          test_id: string
          status?: 'in_progress' | 'completed' | 'abandoned'
          started_at?: string
          completed_at?: string | null
          listening_score?: number | null
          reading_score?: number | null
          writing_score?: number | null
          speaking_score?: number | null
          overall_band_score?: number | null
          time_spent_seconds?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          user_id?: string
          test_id?: string
          status?: 'in_progress' | 'completed' | 'abandoned'
          started_at?: string
          completed_at?: string | null
          listening_score?: number | null
          reading_score?: number | null
          writing_score?: number | null
          speaking_score?: number | null
          overall_band_score?: number | null
          time_spent_seconds?: number | null
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
