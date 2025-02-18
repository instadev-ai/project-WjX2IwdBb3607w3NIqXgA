import { useState } from 'react'
import { Friend, Expense, Split } from '@/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { v4 as uuidv4 } from 'uuid'

interface AddExpenseFormProps {
  friends: Friend[]
  onAddExpense: (expense: Expense) => void
}

export function AddExpenseForm({ friends, onAddExpense }: AddExpenseFormProps) {
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [paidBy, setPaidBy] = useState('')
  const [splits, setSplits] = useState<Split[]>(
    friends.map(friend => ({
      friendId: friend.id,
      amount: 0
    }))
  )

  const handleSplitChange = (friendId: string, value: string) => {
    const newAmount = parseFloat(value) || 0
    setSplits(splits.map(split => 
      split.friendId === friendId 
        ? { ...split, amount: newAmount }
        : split
    ))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const expense: Expense = {
      id: uuidv4(),
      description,
      amount: parseFloat(amount),
      paidBy,
      date: new Date().toISOString(),
      splits: splits.filter(split => split.amount > 0)
    }

    onAddExpense(expense)
    
    // Reset form
    setDescription('')
    setAmount('')
    setPaidBy('')
    setSplits(friends.map(friend => ({
      friendId: friend.id,
      amount: 0
    })))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pt-6">
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="e.g., Dinner at Restaurant"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="amount">Total Amount</Label>
        <Input
          id="amount"
          type="number"
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0.00"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="paidBy">Paid By</Label>
        <Select value={paidBy} onValueChange={setPaidBy}>
          <SelectTrigger>
            <SelectValue placeholder="Select who paid" />
          </SelectTrigger>
          <SelectContent>
            {friends.map((friend) => (
              <SelectItem key={friend.id} value={friend.id}>
                {friend.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        <Label>Split Amount</Label>
        {friends.map((friend) => (
          <div key={friend.id} className="flex items-center gap-4">
            <Label className="w-24">{friend.name}</Label>
            <Input
              type="number"
              step="0.01"
              value={splits.find(s => s.friendId === friend.id)?.amount || ''}
              onChange={(e) => handleSplitChange(friend.id, e.target.value)}
              placeholder="0.00"
            />
          </div>
        ))}
      </div>

      <Button type="submit" className="w-full">
        Add Expense
      </Button>
    </form>
  )
}