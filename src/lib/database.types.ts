export type VaiTro = 'doi_tac' | 'chu_so_huu' | 'nguoi_mua' | 'nhan_vien_ngan_hang'
export type LoaiTaiSan = 'can_ho' | 'nha_pho' | 'dat_nen' | 'biet_thu' | 'van_phong'
export type TrangThaiTaiSan = 'cho_ban' | 'dang_giao_dich' | 'da_ban' | 'cho_thue' | 'dang_thue'
export type TrangThaiGiaoDich = 'tiem_nang' | 'dam_phan' | 'cho_ky_hop_dong' | 'cho_thanh_toan' | 'hoan_thanh' | 'huy_bo'
export type TrangThaiHoSoVay = 'chua_nop' | 'dang_xu_ly' | 'cho_phe_duyet' | 'da_duyet' | 'tu_choi' | 'da_giai_ngan'

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          auth_id: string | null
          ho_ten: string
          email: string
          so_dien_thoai: string | null
          vai_tro: VaiTro
          avatar_url: string | null
          ngay_tao: string
          ngay_cap_nhat: string
        }
        Insert: Omit<Database['public']['Tables']['users']['Row'], 'id' | 'ngay_tao' | 'ngay_cap_nhat'>
        Update: Partial<Database['public']['Tables']['users']['Insert']>
      }
      properties: {
        Row: {
          id: string
          ten: string
          dia_chi: string
          tinh_thanh: string
          loai: LoaiTaiSan
          dien_tich: number
          gia: number
          trang_thai: TrangThaiTaiSan
          chu_so_huu_id: string | null
          mo_ta: string | null
          ngay_dang: string
          ngay_cap_nhat: string
        }
        Insert: Omit<Database['public']['Tables']['properties']['Row'], 'id' | 'ngay_dang' | 'ngay_cap_nhat'>
        Update: Partial<Database['public']['Tables']['properties']['Insert']>
      }
      transactions: {
        Row: {
          id: string
          tai_san_id: string | null
          ten_tai_san: string
          nguoi_ban_id: string | null
          ten_nguoi_ban: string
          nguoi_mua_id: string | null
          ten_nguoi_mua: string
          doi_tac_id: string | null
          ten_doi_tac: string | null
          gia_giao_dich: number
          trang_thai: TrangThaiGiaoDich
          ghi_chu: string | null
          ngay_tao: string
          ngay_cap_nhat: string
        }
        Insert: Omit<Database['public']['Tables']['transactions']['Row'], 'id' | 'ngay_tao' | 'ngay_cap_nhat'>
        Update: Partial<Database['public']['Tables']['transactions']['Insert']>
      }
      loan_applications: {
        Row: {
          id: string
          giao_dich_id: string | null
          khach_hang_id: string | null
          ten_khach_hang: string
          ngan_hang: string
          nhan_vien_id: string | null
          so_tien_vay: number
          lai_suat: number
          thoi_han: number
          trang_thai: TrangThaiHoSoVay
          ghi_chu: string | null
          ngay_nop: string
          ngay_cap_nhat: string
        }
        Insert: Omit<Database['public']['Tables']['loan_applications']['Row'], 'id' | 'ngay_nop' | 'ngay_cap_nhat'>
        Update: Partial<Database['public']['Tables']['loan_applications']['Insert']>
      }
      commissions: {
        Row: {
          id: string
          giao_dich_id: string | null
          ten_tai_san: string
          doi_tac_id: string | null
          ten_doi_tac: string
          ti_le: number
          so_tien: number
          da_thanh_toan: boolean
          ngay_du_kien_thanh_toan: string | null
          ngay_thanh_toan: string | null
          ngay_tao: string
        }
        Insert: Omit<Database['public']['Tables']['commissions']['Row'], 'id' | 'ngay_tao'>
        Update: Partial<Database['public']['Tables']['commissions']['Insert']>
      }
      property_images: {
        Row: {
          id: string
          tai_san_id: string
          url: string
          alt: string | null
          la_anh_chinh: boolean
          thu_tu: number
          ngay_tao: string
        }
        Insert: Omit<Database['public']['Tables']['property_images']['Row'], 'id' | 'ngay_tao'>
        Update: Partial<Database['public']['Tables']['property_images']['Insert']>
      }
      transaction_logs: {
        Row: {
          id: string
          giao_dich_id: string
          nguoi_thuc_hien_id: string | null
          hanh_dong: string
          trang_thai_cu: TrangThaiGiaoDich | null
          trang_thai_moi: TrangThaiGiaoDich | null
          ghi_chu: string | null
          ngay_tao: string
        }
        Insert: Omit<Database['public']['Tables']['transaction_logs']['Row'], 'id' | 'ngay_tao'>
        Update: Partial<Database['public']['Tables']['transaction_logs']['Insert']>
      }
    }
  }
}
