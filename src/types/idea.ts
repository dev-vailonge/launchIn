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

export interface LaunchPlanTask {
  name: string
  description: string
}

export interface LaunchPlanStep {
  title: string
  objective: string
  masterTip: string
  successMeasure: string
  tasks: LaunchPlanTask[]
}

export interface LaunchPlan {
  steps: LaunchPlanStep[]
} 