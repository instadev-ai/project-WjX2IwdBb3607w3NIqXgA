import { Expense, Friend } from '@/types'
import { Card, CardContent } from '@/components/ui/card'
import { formatCurrency } from '@/lib/utils'

interface ExpenseListProps {
  expenses: Expense[]
  friends: Friend[]
}

export function ExpenseList({ expenses, friends }: ExpenseListProps) {
  const getFriendName = (id: string) => {
    return friends.find(f => f.id === id)?.name || 'Unknown'
  }

  if (expenses.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        No expenses yet. Add your first expense to get started!
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {expenses.map((expense) => (
        <Card key={expense.id}>
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium text-gray-900">{expense.description}</h3>
                <p className="text-sm text-gray-500">
                  Paid by {getFriendName(expense.paidBy)}
                </p>
                <div className="mt-2 text-sm text-gray-600">
                  <p>Split between:</p>
                  <ul className="list-disc list-inside">
                    {expense.splits.map((split) => (
                      <li key={split.friendId}>
                        {getFriendName(split.friendId)}: {formatCurrency(split.amount)}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-semibold text-gray-900">
                  {formatCurrency(expense.amount)}
                </p>
                <p className="text-sm text-gray-500">{expense.date}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}