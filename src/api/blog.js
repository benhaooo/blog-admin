import request from '@/utils/request'

// 分类
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

export function insertCategory(data) {
  return request({
    url: `/category/admin/`,
    method: 'post',
    data,
  })
}

export function updateCategory(data) {
  return request({
    url: `/category/admin`,
    method: 'put',
    data,
  })
}

// 标签
export function getTagList() {
  return request({
    url: '/tag/admin/listAll',
    method: 'get',
  })
}
export function delTag(id) {
  return request({
    url: `/tag/admin/${id}`,
    method: 'delete',
  })
}

export function insertTag(data) {
  return request({
    url: `/tag/admin`,
    method: 'post',
    data,
  })
}

export function updateTag(data) {
  return request({
    url: `/tag/admin`,
    method: 'put',
    data,
  })
}

// 文章
export function getArticleList() {
  return request({
    url: '/article/admin/list',
    method: 'get',
  })
}
export function delArticle(id) {
  return request({
    url: `/article/admin/${id}`,
    method: 'delete',
  })
}

export function insertArticle(data) {
  return request({
    url: `/article/admin`,
    method: 'post',
    data,
  })
}

export function updateArticle(data) {
  return request({
    url: `/article/admin`,
    method: 'put',
    data,
  })
}
