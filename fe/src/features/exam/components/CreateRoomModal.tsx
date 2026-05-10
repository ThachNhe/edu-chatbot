import { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import type { RoomOut } from '../types/exam.type'
import { Rocket, Clock, CheckCircle2, ClipboardList } from 'lucide-react'

interface CreateRoomModalProps {
    room: RoomOut | null
    onClose: () => void
}

export function CreateRoomModal({ room, onClose }: CreateRoomModalProps) {
    const [copied, setCopied] = useState(false)

    const examUrl = room
        ? `${window.location.origin}/room/${room.access_code}`
        : ''

    const handleCopy = () => {
        navigator.clipboard.writeText(examUrl)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <Dialog open={room !== null} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2"><Rocket size={16} /> Phòng thi đã được tạo!</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    <p className="text-[13px] text-[#475569]">
                        Chia sẻ link bên dưới cho học sinh. Học sinh truy cập link và làm bài trực tiếp.
                    </p>

                    <div className="rounded-xl border border-[#e2e8f0] bg-[#f8fafc] p-4">
                        <p className="mb-1 text-[11px] font-bold uppercase tracking-wide text-[#94a3b8]">Link phòng thi</p>
                        <p className="break-all font-mono text-[13px] text-[#1a56db]">{examUrl}</p>
                    </div>

                    {room?.expires_at && (
                        <p className="text-[12px] text-[#94a3b8] flex items-center gap-1">
                            <Clock size={13} /> Hết hạn: {new Date(room.expires_at).toLocaleString('vi-VN')}
                        </p>
                    )}

                    <div className="flex gap-2">
                        <button
                            onClick={handleCopy}
                            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-[#1a56db] py-2.5 text-[13px] font-bold text-white hover:bg-[#1d4ed8] transition-colors"
                        >
                            {copied ? <><CheckCircle2 size={14} /> Đã sao chép!</> : <><ClipboardList size={14} /> Sao chép link</>}
                        </button>
                        <button
                            onClick={onClose}
                            className="flex items-center justify-center rounded-xl border border-[#e2e8f0] px-5 py-2.5 text-[13px] font-bold text-[#475569] hover:border-[#1a56db] hover:text-[#1a56db] transition-colors"
                        >
                            Đóng
                        </button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}