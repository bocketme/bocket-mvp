$(document).ready(() => {
  const lauchButtonId = '#signUp';
  const boxId = '#userSignUpBox';
  const toReset = '#userSignUp';
  const visibility = 'display';
  const workspaceBoxId = '#workspaceSignUpBox';
  let already = false;

  begin(lauchButtonId, boxId, toReset);

  $('#userSignUp').on('submit', (e) => {
    e.preventDefault();
    const email = $('#email');
    if ($('#userSignUp').valid()) {
      checkUniqueField(
        'User', 'email', email.val(),
        () => {
          hideBox($(boxId), () => {
            $('#hiddenEmail').val(email.val());
            $('#hiddenPassword').val($('#password').val());
            showBox($(workspaceBoxId));
          });
        },
        () => {
          $('#email').after("<div class='error'>This email is already taken</div>");
        },
      );
    }
  });

  $('.closeBox').click(() => {
    hideBlur($(blurId));
    hideBox($(boxId));
    hideBox($(workspaceBoxId));
    hideBox($('#workspaceCreationBox'));
  });

  $('#workspaceSignUp').on('submit', (e) => {
    if (already) {
      already = false;
      return true;
    }
    if ($('#workspaceSignUp').valid()) {
      e.preventDefault();
      console.log('icii');
      const organizationName = $('#companyName');
      checkUniqueField(
        'Organization', 'name', organizationName.val(),
        () => {
          const completeName = $('#completeName');
          completeName.val(CapitalizeCompleteName(completeName.val()));
          $('#workspaceSignUp').submit();
          already = true;
        },
        () => {
          organizationName.after("<div class='error'>This organization name is already taken</div>");
        },
      );
    }
  });

  $.validator.methods.email = function (value, element) {
    return this.optional(element) || /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(value);
  };

  $.validator.methods.completeName = function (value, element) {
    return this.optional(element) || /[a-z]+ [a-z]+/.test(value);
  };

  $.validator.addMethod(
    'completeName',
    function (value, element) {
      return this.optional(element) || /[a-zA-Z\-]+ [a-zA-Z\-]+/.test(value);
    },
    'Please check your input.',
  );

  $('#userSignUp').validate({
    rules: {
      password: {
        required: true,
        minlength: 6,
      },
      cpassword: {
        required: true,
        equalTo: '#password',
      },
      email: {
        required: true,
        email: true,
      },
    },
    errorElement: 'div',
    errorPlacement(error, element) {
      const placement = $(element).data('error');
      if (placement) {
        $(placement).append(error);
      } else {
        error.insertAfter(element);
      }
    },
  });

  $('#workspaceSignUp').validate({
    rules: {
      completeName: {
        required: true,
        completeName: true,
      },
      companyName: {
        required: true,
      },
      workspaceName: {
        required: true,
      },
    },
    errorElement: 'div',
    errorPlacement(error, element) {
      const placement = $(element).data('error');
      if (placement) {
        $(placement).append(error);
      } else {
        error.insertAfter(element);
      }
    },
  });

  $('#login_id').on('click', () => {
    hideBox($(boxId), () => {
      showBox($('#userSignInBox'));
    });
  });

  function CapitalizeCompleteName(completeName) {
    const tmp = completeName.split(' ');

    tmp[0] = tmp[0].toLowerCase();
    tmp[1] = tmp[1].toLowerCase();

    tmp[0] = tmp[0].charAt(0).toUpperCase() + tmp[0].slice(1);
    tmp[1] = tmp[1].charAt(0).toUpperCase() + tmp[1].slice(1);

    return `${tmp[0]} ${tmp[1]}`;
  }
});
