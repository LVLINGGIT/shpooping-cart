$(function () {
    /*全选---店铺的选择---商品的选择*/
  var $allCheckbox=$('input[type="checkbox"]'),
        $whole_check=$('.whole_check'),
        $shopChoice=$('.shopChoice'),
        $son_check=$('.son_check'),
        $cartBox=$('.cartBox');

    //点击checkbox时，画钩（加图片）
    $allCheckbox.click(function () {
        if($(this).is(':checked')){
            $(this).next('label').addClass('mark');
        }else{
            $(this).next('label').removeClass('mark');
        }
        totalMoney();
    });
    //点击全选时，全部画钩
    $whole_check.click(function () {
        // var $cartboxs=$cartBox.find('input[type="checkbox"]');
        // console.log($cartboxs);
        if($(this).is(':checked')){
            $allCheckbox.prop("checked",true);
            $allCheckbox.next('label').addClass('mark');
        }else{
            $allCheckbox.prop("checked",false);
            $allCheckbox.next('label').removeClass('mark');
        }
        totalMoney();
    })
    //单选按钮全点击时，全选被点击
    $son_check.each(function () {
        $(this).click(function () {
           if($(this).is(':checked')){
               var len=$son_check.length;
               var num=0;
               $son_check.each(function () {
                   if($(this).is(':checked')){
                       num++;
                   }
               });
               if(num==len){
                   $whole_check.prop("checked",true);
                   $whole_check.next('label').addClass('mark');
               }
           }else{
               $whole_check.prop("checked",false);
               $whole_check.next('label').removeClass('mark');
           }
            totalMoney();
        });
    });

    //店铺有一个未选中，全选按钮取消对勾，若店铺全选中，则全选按钮打对勾
    $shopChoice.each(function () {
        $(this).click(function () {
            if($(this).is(':checked')){
                var len=$shopChoice.length;
                var num=0;
                $shopChoice.each(function () {
                    if($(this).is(':checked')){
                        num++;
                    }
                })
                if (num==len) {
                    $whole_check.prop("checked",true);
                   $whole_check.next('label').addClass('mark');
                }

                //店铺选中状态---店铺下的全部商品选中
                $(this).parents('.cartBox').find('.son_check').attr('checked',true);
                $(this).parents('.cartBox').find('.son_check').next('label').addClass('mark');
            }else{
                $whole_check.prop("checked",false);
               $whole_check.next('label').removeClass('mark');

               //店铺没选中状态---店铺下的全部商品不选中
               $(this).parents('.cartBox').find('.son_check').attr('checked',false);
                $(this).parents('.cartBox').find('.son_check').next('label').removeClass('mark');
            }
            totalMoney();
        });
    });

    //店铺中商品有一个钩未选中，店铺上的钩取消选中
    $cartBox.each(function () {
        var $this=$(this);
        $cartBox_son_check=$this.find('.son_check');
        $cartBox_son_check.each(function () {
            $(this).click(function () {
                if($(this).is(':checked')){
                    var len=$cartBox_son_check.length;
                    var num=0;
                    $cartBox_son_check.each(function () {
                        if($(this).is(':checked')){
                            num++;
                        }
                    });
                    if(num==len){
                        $this.find('.shopChoice').attr("checked",true);
                        $this.find('.shopChoice').next('label').addClass('mark');
                    }
                }else{
                    $(this).parents('.cartBox').find('.shopChoice').attr("checked",false);
                    $(this).parents('.cartBox').find('.shopChoice').next('label').removeClass('mark');
                }
                totalMoney();
            });
        });
    });


    /*商品的数量的  加减*/
    var $reduce=$('.reduce'),
        $sum=$('.sum'),
        $plus=$('.plus');
    //数量加
    $plus.click(function () {
        var $inputVal=$(this).prev('input'),
            $count = parseInt($inputVal.val())+1,
            $reduceObj = $(this).parents('.amount_box').find('.reduce')
            $priceTotalObj=$(this).parents('.order_lists').find('.sum_price'),
            $price=$(this).parents('.order_lists').find('.price').html();
            $priceTotal=$count*parseInt($price.substring(1));

        $inputVal.val($count);
        $priceTotalObj.html('￥'+$priceTotal);
        if ($inputVal.val()>1 && $reduceObj.hasClass('reSty')) {
            $reduceObj.removeClass('reSty');
        }
        totalMoney();
    });
    //数量减
    $reduce.click(function () {
        var $inputVal=$(this).next('input'),
            $count = parseInt($inputVal.val())-1,
            $priceTotalObj=$(this).parents('.order_lists').find('.sum_price'),
            $price=$(this).parents('.order_lists').find('.price').html();
            $priceTotal=$count*parseInt($price.substring(1));
            ;
        if ($inputVal.val()>1) {
            $inputVal.val($count);
            $priceTotalObj.html('￥'+$priceTotal);
        }
        if($inputVal.val()==1 && !$(this).hasClass('reSty')){
            $(this).addClass('reSty');
        }
        totalMoney();
    });
    //改变input的值
    $sum.keyup(function () {
        var $count = 0,
            $priceTotalObj=$(this).parents('.order_lists').find('.sum_price'),
            $price=$(this).parents('.order_lists').find('.price').html();
            $priceTotal=0;
        if ($(this).val()=='') {
            $(this).val('1');
        }
        $(this).val($(this).val().replace(/\D|^0/g,''));
        $count=$(this).val();
        $priceTotal=$count*parseInt($price.substring(1));
        $(this).attr('value',$count);
        $priceTotalObj.html('￥'+$priceTotal);
        totalMoney();
    });


    /*移除商品*/
    //点击出现模态框
    var $delBtn=$('.delBtn');
    var $order_lists=null;
    var $order_content = '';
    $delBtn.click(function () {
        $order_lists=$(this).parents('.order_lists');

        $order_content = $order_lists.parents('.order_content');
        $('.model_bg').fadeIn('fast');
        $('.my_model').fadeIn('fast');
    });
    //关闭模态框
    $('.closeModel').click(function () {
        closeM();
    })
    //点击确定，移除商品
    $('.dialog-sure').click(function () {
        $order_lists.remove();
        if ($order_content.html().trim()==null || $order_content.html().trim().length==0) {
            $order_content.parents('.cartBox').remove();
        }
        closeM();
        $son_check=$('.son_check');//获取新的的商品元素
        totalMoney();
    })
    //点击取消，不移除商品，关闭模态框
    $('.dialog-close').click(function () {
        closeM();
    })
    function closeM(){
        $('.model_bg').fadeOut(300);
        $('.my_model').fadeOut(300);
    }



    /*总计*/
    function totalMoney(){
        var total_money=0;
        var total_count=0;
        $son_check.each(function () {
            if($(this).is(':checked')){
               var goodsPrice=parseInt($(this).parents('.order_lists').find('.sum_price').html().substring(1));
               var num=parseInt($(this).parents('.order_lists').find('.sum').val());
               total_money += goodsPrice;
               total_count +=num;
            }
        });
        $('.piece_num').html('￥'+total_count);
        $('.total_text').html('￥'+total_money);

        if(total_money !=0 && total_count !=0){
            if (!$('.calBtn a').hasClass('btn_sty')) {
                $('.calBtn a').addClass('btn_sty');
            }
        }else{
            $('.calBtn a').removeClass('btn_sty');
        }
    }


})