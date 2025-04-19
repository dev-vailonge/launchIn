export interface BusinessIdea {
  title: string
  description: string
  targetAudience: string
  challenges: string
  saved?: boolean
}

export interface GeneratedIdeas {
  ideas: BusinessIdea[]
} 