<template>
  <div class="category-container">
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
      <el-col :span="1.5">
        <el-button icon="Delete" plain type="danger">批量删除</el-button>
      </el-col>
      <right-toolbar />
    </el-row>

    <el-table v-loading="loading" border :data="categoryList" @selection-change="handleSelectionChange">
      <!-- 表格列 -->
      <el-table-column align="center" type="selection" width="55" />
      <!-- 分类名 -->
      <el-table-column align="center" label="分类名" prop="name" width="300" />
      <!-- 分类名 -->
      <el-table-column align="center" label="描述" prop="description" width="300" />
      <!-- 文章量 -->
      <el-table-column align="center" label="文章量" prop="articleCount" />
      <!-- 创建时间 -->
      <el-table-column align="center" label="创建时间" prop="createTime" width="300">
        <!-- <template #default="scope">
          <div class="create-time">
            <el-icon>
              <clock />
            </el-icon>
            <span style="margin-left: 10px">{{ formatDate(scope.row.createTime) }}</span>
          </div>
        </template> -->
      </el-table-column>
      <!-- 操作 -->
      <el-table-column align="center" label="操作" width="300">
        <template #default="scope">
          <el-button icon="Edit" link type="primary" @click="openModel(scope.row)">编辑</el-button>
          <el-button icon="Delete" link type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog append-to-body :title="dialogTitle" :visible.sync="showDialog" width="500px">
      <el-form ref="categoryFormRef" label-width="100px" :model="categoryForm" @submit.native.prevent>
        <el-form-item label="分类名称" prop="categoryName">
          <el-input v-model="categoryForm.name" placeholder="请输入分类名称" :rules="rules" style="width: 250px" />
        </el-form-item>
        <el-form-item label="分类描述" prop="description">
          <el-input v-model="categoryForm.description" placeholder="请输入分类描述" style="width: 250px" />
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
  import { getCategoryList, delCategory, insertCategory, updateCategory } from '@/api/blog'

  const data = reactive({
    loading: false,
    categoryList: [],
    categoryForm: {},
    dialogTitle: '',
    showDialog: false,
  })

  const { loading, categoryList, categoryForm, dialogTitle, showDialog } = toRefs(data)

  const categoryFormRef = ref(null)

  // validate rules
  const rules = reactive({
    name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }],
  })

  const getList = () => {
    getCategoryList().then((res) => {
      categoryList.value = res.data
    })
  }

  const handleSelectionChange = () => {}
  const openModel = (category) => {
    // categoryFormRef.value?.clearValidate()
    if (category) {
      categoryForm.value = Object.assign({}, category)
      dialogTitle.value = '编辑分类'
    } else {
      categoryForm.value = {}
      dialogTitle.value = '新增分类'
    }
    showDialog.value = true
  }
  const handleDelete = (id) => {
    delCategory(id).then(() => {
      getList()
      Vue.prototype.$baseNotify('删除成功')
    })
  }

  const submitForm = () => {
    console.log('###################')
    console.log(categoryForm.value)
    categoryFormRef.value?.validate((valid) => {
      console.log(valid)
      if (valid) {
        if (categoryForm.value.id) {
          console.log(categoryForm.value.id)
          updateCategory(categoryForm.value).then(({ data }) => {
            Vue.prototype.$baseNotify('修改成功')
            getList()
            showDialog.value = false
          })
        } else {
          insertCategory(categoryForm.value).then(({ data }) => {
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
