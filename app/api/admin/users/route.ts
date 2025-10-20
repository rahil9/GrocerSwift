import { NextRequest, NextResponse } from 'next/server'

// Mock users data that simulates Firebase Authentication users
// In a real application, you would fetch this from Firebase Authentication
const mockUsers = [
  {
    id: "user1",
    email: "john.doe@example.com",
    displayName: "John Doe",
    createdAt: "2024-01-15T10:30:00Z",
    lastLoginAt: "2024-01-20T14:22:00Z",
    isAdmin: false,
    profile: {
      firstName: "John",
      lastName: "Doe",
    }
  },
  {
    id: "user2", 
    email: "jane.smith@example.com",
    displayName: "Jane Smith",
    createdAt: "2024-01-20T09:15:00Z",
    lastLoginAt: "2024-01-22T16:45:00Z",
    isAdmin: false,
    profile: {
      firstName: "Jane",
      lastName: "Smith",
    }
  },
  {
    id: "user3",
    email: "mike.johnson@example.com", 
    displayName: "Mike Johnson",
    createdAt: "2024-02-01T11:20:00Z",
    lastLoginAt: "2024-02-05T13:30:00Z",
    isAdmin: true,
    profile: {
      firstName: "Mike",
      lastName: "Johnson",
    }
  },
  {
    id: "user4",
    email: "sarah.wilson@example.com",
    displayName: "Sarah Wilson", 
    createdAt: "2024-02-10T08:45:00Z",
    lastLoginAt: "2024-02-12T10:15:00Z",
    isAdmin: false,
    profile: {
      firstName: "Sarah",
      lastName: "Wilson",
    }
  },
  {
    id: "user5",
    email: "david.brown@example.com",
    displayName: "David Brown",
    createdAt: "2024-02-15T15:30:00Z", 
    lastLoginAt: "2024-02-18T12:00:00Z",
    isAdmin: false,
    profile: {
      firstName: "David",
      lastName: "Brown",
    }
  }
]

export async function GET() {
  try {
    // Return mock users data
    // In production, you would fetch from Firebase Authentication here
    return NextResponse.json(mockUsers)
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { userId } = await request.json()
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    // In a real application, you would delete the user from Firebase Authentication here
    console.log(`Would delete user: ${userId}`)
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting user:', error)
    return NextResponse.json(
      { error: 'Failed to delete user' },
      { status: 500 }
    )
  }
}
