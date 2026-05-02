export type VaiTro = 'doi_tac' | 'chu_so_huu' | 'nguoi_mua' | 'nhan_vien_ngan_hang'

export interface User {
  id: string
  ho_ten: string
  email: string
  so_dien_thoai: string
  vai_tro: VaiTro
  ngay_tao: string
}

export type TrangThaiTaiSan = 'cho_ban' | 'dang_giao_dich' | 'da_ban' | 'cho_thue' | 'dang_thue'

export interface TaiSan {
  id: string
  ten: string
  dia_chi: string
  tinh_thanh: string
  loai: 'can_ho' | 'nha_pho' | 'dat_nen' | 'biet_thu' | 'van_phong'
  dien_tich: number
  gia: number
  trang_thai: TrangThaiTaiSan
  chu_so_huu_id: string
  anh_dai_dien?: string
  ngay_dang: string
}

export type TrangThaiGiaoDich =
  | 'tiem_nang'
  | 'dam_phan'
  | 'cho_ky_hop_dong'
  | 'cho_thanh_toan'
  | 'hoan_thanh'
  | 'huy_bo'

export interface GiaoDich {
  id: string
  tai_san_id: string
  ten_tai_san: string
  nguoi_ban_id: string
  ten_nguoi_ban: string
  nguoi_mua_id: string
  ten_nguoi_mua: string
  doi_tac_id?: string
  ten_doi_tac?: string
  gia_giao_dich: number
  ngay_tao: string
  ngay_cap_nhat: string
  trang_thai: TrangThaiGiaoDich
  ghi_chu?: string
}

export type TrangThaiHoSoVay =
  | 'chua_nop'
  | 'dang_xu_ly'
  | 'cho_phe_duyet'
  | 'da_duyet'
  | 'tu_choi'
  | 'da_giai_ngan'

export interface HoSoVay {
  id: string
  giao_dich_id: string
  khach_hang_id: string
  ten_khach_hang: string
  ngan_hang: string
  nhan_vien_id?: string
  so_tien_vay: number
  lai_suat: number
  thoi_han: number
  trang_thai: TrangThaiHoSoVay
  ngay_nop: string
  ngay_cap_nhat: string
  ghi_chu?: string
}

export interface HoaHong {
  id: string
  giao_dich_id: string
  ten_tai_san: string
  doi_tac_id: string
  ten_doi_tac: string
  ti_le: number
  so_tien: number
  da_thanh_toan: boolean
  ngay_du_kien_thanh_toan?: string
  ngay_thanh_toan?: string
}
