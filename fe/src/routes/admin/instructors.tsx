import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { useAdminInstructors, useAddAdminInstructor } from '@/features/admin'

export const Route = createFileRoute('/admin/instructors')({
    component: AdminInstructorsPage,
})

function AdminInstructorsPage() {
    const { data: instructors, isLoading } = useAdminInstructors()
    const { mutate: addInstructor, isPending } = useAddAdminInstructor()
    
    const [isAdding, setIsAdding] = useState(false)
    const [form, setForm] = useState({ name: '', email: '', password: '' })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        addInstructor(form, {
            onSuccess: () => {
                setIsAdding(false)
                setForm({ name: '', email: '', password: '' })
            }
        })
    }

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Quản trị Giáo viên</h1>
                <button 
                    onClick={() => setIsAdding(!isAdding)}
                    className="bg-purple-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-purple-700 transition"
                >
                    {isAdding ? 'Hủy' : '+ Thêm Giáo viên'}
                </button>
            </div>

            {isAdding && (
                <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border mb-6 space-y-4 max-w-lg">
                    <h2 className="text-lg font-semibold">Tạo tải khoản Giáo viên</h2>
                    <div>
                        <label className="block text-sm font-medium mb-1">Họ và tên</label>
                        <input required value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full border rounded-lg p-2" placeholder="Nguyễn Văn A" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Email</label>
                        <input required type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full border rounded-lg p-2" placeholder="email@example.com" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Mật khẩu</label>
                        <input required type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} className="w-full border rounded-lg p-2" placeholder="Mật khẩu đăng nhập" />
                    </div>
                    <button disabled={isPending} type="submit" className="w-full bg-purple-600 text-white p-2 rounded-lg font-medium hover:bg-purple-700 disabled:opacity-50">
                        {isPending ? 'Đang tạo...' : 'Tạo tài khoản'}
                    </button>
                </form>
            )}

            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 text-gray-600">
                        <tr>
                            <th className="p-4 font-semibold">Họ và Tên</th>
                            <th className="p-4 font-semibold">Email</th>
                            <th className="p-4 font-semibold">Vai trò</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {isLoading ? (
                            <tr><td colSpan={3} className="p-4 text-center text-gray-500">Đang tải...</td></tr>
                        ) : instructors?.length === 0 ? (
                            <tr><td colSpan={3} className="p-4 text-center text-gray-500">Chưa có giáo viên nào</td></tr>
                        ) : (
                            instructors?.map(user => (
                                <tr key={user.id} className="hover:bg-gray-50">
                                    <td className="p-4 font-medium">{user.name}</td>
                                    <td className="p-4">{user.email}</td>
                                    <td className="p-4 capitalize">{user.role === 'teacher' ? 'Giáo viên' : user.role}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
