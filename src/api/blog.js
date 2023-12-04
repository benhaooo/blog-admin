import request from '@/utils/request'

export function getCategoryList() {
  return request({
    url: '/category/admin/listAll',
    method: 'get',
  })
}
export function delCategory(id) {
  return request({
    url: `/category/admin/${id}`,
    method: 'delete',
  })
}
