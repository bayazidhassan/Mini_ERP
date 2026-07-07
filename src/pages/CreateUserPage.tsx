import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCreateUserMutation } from '@/redux/api/userApi';
import { ArrowLeft, Lock, Mail, ShieldCheck, UserPlus } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getErrorMessage } from '../utils/getErrorMessage';

const CreateUserPage = () => {
  const navigate = useNavigate();
  const [createUser, { isLoading }] = useCreateUserMutation();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'employee' as 'admin' | 'manager' | 'employee',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await createUser(form).unwrap();
      setSuccess(`User "${form.name}" created successfully.`);
      setForm({ name: '', email: '', password: '', role: 'employee' });
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to create user.'));
    }
  };

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate('/dashboard')}
          className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-800"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Create User</h1>
          <p className="text-sm text-gray-500">
            Add a new Manager or Employee account
          </p>
        </div>
      </div>

      <Card className="shadow-sm">
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label
                htmlFor="name"
                className="flex items-center gap-1.5 text-gray-700"
              >
                <UserPlus className="h-4 w-4 text-gray-400" />
                Full Name
              </Label>
              <Input
                id="name"
                name="name"
                placeholder="e.g. John Doe"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="flex items-center gap-1.5 text-gray-700"
              >
                <Mail className="h-4 w-4 text-gray-400" />
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="e.g. john@company.com"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="flex items-center gap-1.5 text-gray-700"
              >
                <Lock className="h-4 w-4 text-gray-400" />
                Password
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Minimum 6 characters"
                value={form.password}
                onChange={handleChange}
                required
                minLength={6}
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="role"
                className="flex items-center gap-1.5 text-gray-700"
              >
                <ShieldCheck className="h-4 w-4 text-gray-400" />
                Role
              </Label>
              <select
                id="role"
                name="role"
                value={form.role}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
                required
              >
                <option value="manager">Manager</option>
                <option value="employee">Employee</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-600">
                {error}
              </div>
            )}

            {success && (
              <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-2.5 text-sm text-green-600">
                {success}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Creating...' : 'Create User'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateUserPage;
