<template>
  <div class="article-container">
    <el-form :inline="true">
      <el-form-item label="分类名称">
        <el-input clearable placeholder="请输入分类名称" style="width: 200px" />
      </el-form-item>
      <el-form-item>
        <el-button icon="Search" type="primary">搜索</el-button>
      </el-form-item>
    </el-form>

    <el-row class="mb15" :gutter="10">
      <el-col :span="1.5">
        <el-button icon="Plus" plain type="primary" @click="openModel()">新增</el-button>
      </el-col>
      <right-toolbar />
    </el-row>

    <el-table v-loading="loading" border :data="articleList" @selection-change="handleSelectionChange">
      <el-table-column align="center" type="selection" width="55" />
      <el-table-column align="center" label="标题" prop="title" />
      <el-table-column align="center" label="分类" prop="category" />
      <el-table-column align="center" label="标签" prop="category" />
      <el-table-column align="center" label="浏览量" prop="category" />
      <el-table-column align="center" label="点赞量" prop="category" />
      <el-table-column align="center" label="封面" prop="category" />
      <el-table-column align="center" label="评论数" prop="articleCount" />
      <el-table-column align="center" label="创建时间" prop="createTime" width="300" />
      <el-table-column align="center" label="操作" width="300">
        <template #default="scope">
          <el-button icon="Edit" link type="primary" @click="openModel(scope.row)">编辑</el-button>
          <el-button icon="Delete" link type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog append-to-body :title="dialogTitle" :visible.sync="showDialog" width="500px">
      <el-form ref="categoryFormRef" label-width="100px" :model="articleForm" @submit.native.prevent>
        <el-form-item label="分类名称" prop="categoryName">
          <el-input v-model="articleForm.name" placeholder="请输入分类名称" :rules="rules" style="width: 250px" />
        </el-form-item>
        <el-form-item label="颜色" prop="color">
          <el-color-picker v-model="articleForm.color" />
        </el-form-item>
      </el-form>
      <template slot="footer">
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="showDialog = false">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
  import Vue from 'vue'
  import { ref, reactive, toRefs, onMounted } from 'vue'
  import { getArticleList, delArticle, insertArticle, updateArticle } from '@/api/blog'

  const data = reactive({
    loading: false,
    articleList: [],
    articleForm: {},
    dialogTitle: '',
    showDialog: false,
  })

  const { loading, articleList, articleForm, dialogTitle, showDialog } = toRefs(data)

  const categoryFormRef = ref(null)

  // validate rules
  const rules = reactive({
    name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }],
  })

  const getList = () => {
    getArticleList().then((res) => {
      articleList.value = res.data.rows
    })
  }

  const handleSelectionChange = () => {}
  const openModel = (category) => {
    categoryFormRef.value?.clearValidate()
    if (category) {
      articleForm.value = Object.assign({}, category)
      dialogTitle.value = '编辑分类'
    } else {
      articleForm.value = {}
      dialogTitle.value = '新增分类'
    }
    showDialog.value = true
  }
  const handleDelete = (id) => {
    delArticle(id).then(() => {
      getList()
      Vue.prototype.$baseNotify('删除成功')
    })
  }

  const submitForm = () => {
    categoryFormRef.value?.validate((valid) => {
      if (valid) {
        if (articleForm.value.id) {
          console.log(articleForm.value.id)
          updateArticle(articleForm.value).then(({ data }) => {
            Vue.prototype.$baseNotify('修改成功')
            getList()
            showDialog.value = false
          })
        } else {
          insertArticle(articleForm.value).then(({ data }) => {
            Vue.prototype.$baseNotify('新增成功')
            getList()
            showDialog.value = false
          })
        }
      }
    })
  }

  onMounted(() => {
    getList()
  })
</script>

<style lang="less" scoped></style>
