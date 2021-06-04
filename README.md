 ```js
      savecostResult(param).then(response => {
        if (response.status === '1') {
          this.$refs.conclusion.dataIsMotify = false
          this.feestatus = true
          updateResults(this.casepro).then(res => {
            if (res.status === '1') {
              this.caseSt = true
              if (this.node !== 'invest_firsttrial') {
                if (this.feestatus) {
                  this.$message.success('保存成功！')
                } else {
                  this.$message.warning(this.feeRease + '！')
                }
              } else {
                if (this.feestatus && this.caseSt) {
                  this.$message.success('保存成功！')
                } else {
                  this.$message.warning(this.feeRease + '   ' + this.caseRease + '！')
                }
              }
              this.getSurveyResult()
              this.getCaseCostInfo()
            } else {
              this.caseRease = res.data
            }
          })
          // this.$message.success('保存成功！')
        } else {
          this.feeRease = response.data
          this.$message.error(response.data)
        }
      }).catch(error => {
        this.$message.error('保存异常！')
        return
      }).finally(() => {
        setTimeout(() => {
          this.processLoading = false
        }, 200)
      })