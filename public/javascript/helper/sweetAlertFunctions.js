export async function confirmAlert(title, text) {
    const action = Swal.fire({
        title: title,
        text: text,
        showCancelButton: true,
        confirmButtonColor: "#2060f7",
        reverseButtons: true,
    });

    return action;
}

export function showSwalSuccessToast(title, text) {
    Swal.fire({
        toast: true,
        showConfirmButton: false,
        position: 'top',
        timer: 3000,
        timerProgressBar: true,
        title: title,
        text: text,
        icon: 'success'
    });
}

export function showSwalErrorToast(title, text) {
    Swal.fire({
        toast: true,
        showConfirmButton: false,
        position: 'top',
        timer: 3000,
        timerProgressBar: true,
        title: title,
        text: text,
        icon: 'error'
    });
}

export function showRedirectMessage(text) {
    Swal.fire({
        title: text,
        confirmButtonColor: "#2060f7",
        reverseButtons: true,
    });
}