import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { useAdminStudents, useAddAdminStudent } from '@/features/admin'

export const Route = createFileRoute('/admin/students')({
    component: AdminStudentsPage,
})

function AdminStudentsPage() {
    const { data: students, isLoading } = useAdminStudents()
    const { mutate: addStudent, isPending } = useAddAdminStudent()
    
    const [isAdding, setIsAdding] = useState(false)
    const [form, setForm] = useState({ name: '', class_name: '', student_code: '', email: '' })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        addStudent(form, {
            onSuccess: () => {
                setIsAdding(false)
                setForm({ name: '', class_name: '', student_code: '', email: '' })
            }
        })
    }

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Quản trị Học sinh</h1>
                <button 
                    onClick={() => setIsAdding(!isAdding)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-blue-700 transition"
                >
                    {isAdding ? 'Hủy' : '+ Thêm Học sinh'}
                </button>
            </div>

            {isAdding && (
                <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border mb-6 space-y-4 max-w-lg">
                    <h2 className="text-lg font-semibold">Thêm Học sinh Mới</h2>
                    <div>
                        <label className="block text-sm font-medium mb-1">Mã học sinh</label>
                        <input required value={form.student_code} onChange={e => setForm({...form, student_code: e.target.value})} className="w-full border rounded-lg p-2" placeholder="VD: HS001" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Họ và tên</label>
                        <input required value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full border rounded-lg p-2" placeholder="Nguyễn Văn A" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Lớp</label>
                        <input value={form.class_name} onChange={e => setForm({...form, class_name: e.target.value})} className="w-full border rounded-lg p-2" placeholder="12A1" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Email</label>
                        <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full border rounded-lg p-2" placeholder="email@example.com" />
                    </div>
                    <button disabled={isPending} type="submit" className="w-full bg-blue-600 text-white p-2 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50">
                        {isPending ? 'Đang lưu...' : 'Lưu thông tin'}
                    </button>
                </form>
            )}

            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 text-gray-600">
                        <tr>
                            <th className="p-4 font-semibold">Mã HS</th>
                            <th className="p-4 font-semibold">Họ và Tên</th>
                            <th className="p-4 font-semibold">Lớp</th>
                            <th className="p-4 font-semibold">Email</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {isLoading ? (
                            <tr><td colSpan={4} className="p-4 text-center text-gray-500">Đang tải...</td></tr>
                        ) : students?.length === 0 ? (
                            <tr><td colSpan={4} className="p-4 text-center text-gray-500">Chưa có học sinh nào</td></tr>
                        ) : (
                            students?.map(s => (
                                <tr key={s.id} className="hover:bg-gray-50">
                                    <td className="p-4 font-medium">{s.student_code || '-'}</td>
                                    <td className="p-4">{s.name}</td>
                                    <td className="p-4">{s.class_name || '-'}</td>
                                    <td className="p-4">{s.email || '-'}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
