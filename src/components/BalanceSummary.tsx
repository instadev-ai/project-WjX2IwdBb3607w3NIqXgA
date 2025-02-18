import { Expense, Friend, Balance } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency } from '@/lib/utils'

interface BalanceSummaryProps {
  expenses: Expense[]
  friends: Friend[]
}

export function BalanceSummary({ expenses, friends }: BalanceSummaryProps) {
  const calculateBalances = (): Balance[] => {
    const balances: { [key: string]: number } = {}
    
    // Initialize balances
    friends.forEach(friend => {
      balances[friend.id] = 0
    })

    // Calculate net balance for each person
    expenses.forEach(expense => {
      // Add amount to person who paid
      balances[expense.paidBy] += expense.amount

      // Subtract split amounts from each person
      expense.splits.forEach(split => {
        balances[split.friendId] -= split.amount
      })
    })

    return Object.entries(balances).map(([friendId, amount]) => ({
      friendId,
      amount
    }))
  }

  const getSettlementSuggestions = (balances: Balance[]) => {
    const suggestions: { from: string; to: string; amount: number }[] = []
    const debtors = balances.filter(b => b.amount < 0)
    const creditors = balances.filter(b => b.amount > 0)

    debtors.forEach(debtor => {
      let remainingDebt = Math.abs(debtor.amount)
      creditors.forEach(creditor => {
        if (remainingDebt > 0 && creditor.amount > 0) {
          const amount = Math.min(remainingDebt, creditor.amount)
          if (amount > 0) {
            suggestions.push({
              from: debtor.friendId,
              to: creditor.friendId,
              amount
            })
            remainingDebt -= amount
          }
        }
      })
    })

    return suggestions
  }

  const balances = calculateBalances()
  const settlements = getSettlementSuggestions(balances)

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Balance Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {balances.map(balance => {
              const friend = friends.find(f => f.id === balance.friendId)
              return (
                <div key={balance.friendId} className="flex justify-between items-center">
                  <span>{friend?.name}</span>
                  <span className={balance.amount >= 0 ? 'text-green-600' : 'text-red-600'}>
                    {formatCurrency(balance.amount)}
                  </span>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {settlements.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Settlement Suggestions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {settlements.map((settlement, index) => {
                const from = friends.find(f => f.id === settlement.from)?.name
                const to = friends.find(f => f.id === settlement.to)?.name
                return (
                  <div key={index} className="text-sm">
                    <span className="font-medium">{from}</span> should pay{' '}
                    <span className="font-medium">{formatCurrency(settlement.amount)}</span> to{' '}
                    <span className="font-medium">{to}</span>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}