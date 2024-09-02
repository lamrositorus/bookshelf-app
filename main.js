// Kunci penyimpanan untuk localStorage
const STORAGE_KEY = "BOOKSHELF_APP";

// Mengambil data buku dari localStorage
const getBooksFromLocalStorage = () => {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    return serializedData ? JSON.parse(serializedData) : []; // Mengembalikan array kosong jika tidak ada data
};

// Menyimpan data buku ke localStorage          
const saveBooksToLocalStorage = (books) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
};

// Menampilkan buku-buku yang ada di localStorage
const displayBooks = (booksToDisplay = null) => {
    const incompleteBookList = document.getElementById("incompleteBookList");
    const completeBookList = document.getElementById("completeBookList");
    incompleteBookList.innerHTML = "";
    completeBookList.innerHTML = "";

    // Pastikan books adalah array
    const books = Array.isArray(booksToDisplay) ? booksToDisplay : getBooksFromLocalStorage();

    books.forEach(book => {
        // Membuat elemen untuk setiap buku
        const bookItem = document.createElement("div");
        bookItem.dataset.bookid = book.id;
        bookItem.dataset.testid = "bookItem";

        bookItem.innerHTML = `
        <h3 data-testid="bookItemTitle">${book.title}</h3>
        <p data-testid="bookItemAuthor">Penulis: ${book.author}</p>
        <p data-testid="bookItemYear">Tahun: ${book.year}</p>
        <div class="action">
        <button class="button1" data-testid="bookItemIsCompleteButton">${book.isComplete ? "Belum selesai dibaca" : "Selesai dibaca"}</button>
        <button class="button1" data-testid="bookItemDeleteButton">Hapus Buku</button>
        <button class="button1" data-testid="bookItemEditButton">Edit Buku</button>
        </div>
        <hr>
    `;

        // Menambahkan buku ke rak yang sesuai
        if (book.isComplete) {
            completeBookList.appendChild(bookItem);
        } else {
            incompleteBookList.appendChild(bookItem);
        }
    });
};

// Menangani event saat form buku disubmit
document.getElementById("bookForm").addEventListener("submit", function (event) {
    event.preventDefault(); // Mencegah form dari reload halaman

    // Mengambil nilai input dari form
    const title = document.getElementById("bookFormTitle").value;
    const author = document.getElementById("bookFormAuthor").value;
    const year = parseInt(document.getElementById("bookFormYear").value);
    const isComplete = document.getElementById("bookFormIsComplete").checked;

    // Mendapatkan daftar buku dari localStorage
    const books = getBooksFromLocalStorage();

    // Cek jika ada buku yang sedang diedit
    const editBookId = document.getElementById("bookForm").dataset.editBookId;

    if (editBookId) {
        // Jika sedang mengedit buku, update data buku yang ada
        const bookIndex = books.findIndex(b => b.id === parseInt(editBookId));
        if (bookIndex >= 0) {
            books[bookIndex].title = title;
            books[bookIndex].author = author;
            books[bookIndex].year = year;
            books[bookIndex].isComplete = isComplete;
        }
        // Hapus ID buku yang sedang diedit setelah update
        delete document.getElementById("bookForm").dataset.editBookId;
    } else {
        // Jika buku baru, tambahkan ke daftar buku
        const book = {
            id: new Date().getTime(), // ID unik berdasarkan timestamp
            title,
            author,
            year,
            isComplete
        };
        books.push(book);
    }

    // Menyimpan buku ke localStorage
    saveBooksToLocalStorage(books);

    // Memperbarui daftar buku yang ditampilkan
    displayBooks();
    document.getElementById("bookForm").reset(); // Reset form setelah submit
    Swal.fire({
        title: "Good job!",
        text: "You clicked the button!",
        icon: "success"
    });
});

// Menangani klik pada tombol yang ada di daftar buku
document.addEventListener("click", function (event) {
    // Menangani tombol untuk mengubah status buku
    if (event.target.dataset.testid === "bookItemIsCompleteButton") {
        const bookId = event.target.closest("[data-bookid]").dataset.bookid;
        const books = getBooksFromLocalStorage();
        const book = books.find(b => b.id === parseInt(bookId));
        book.isComplete = !book.isComplete; // Mengubah status buku
        saveBooksToLocalStorage(books);
        displayBooks();
    }

    // Menangani klik pada tombol hapus buku
    if (event.target.dataset.testid === "bookItemDeleteButton") {
        const bookId = event.target.closest("[data-bookid]").dataset.bookid;
        const books = getBooksFromLocalStorage();
        const filteredBooks = books.filter(b => b.id !== parseInt(bookId));
        saveBooksToLocalStorage(filteredBooks);
        displayBooks();
    }

    // Menangani klik pada tombol edit buku
    if (event.target.dataset.testid === "bookItemEditButton") {
        const bookId = event.target.closest("[data-bookid]").dataset.bookid;
        const books = getBooksFromLocalStorage();
        const book = books.find(b => b.id === parseInt(bookId));

        // Mengisi form dengan data buku yang akan diedit
        document.getElementById("bookFormTitle").value = book.title;
        document.getElementById("bookFormAuthor").value = book.author;
        document.getElementById("bookFormYear").value = book.year;
        document.getElementById("bookFormIsComplete").checked = book.isComplete;

        // Menyimpan ID buku yang sedang diedit di atribut data
        document.getElementById("bookForm").dataset.editBookId = book.id;
    }
});

// Menangani pencarian buku
document.getElementById("searchBook").addEventListener("submit", function (event) {
    event.preventDefault();

    const searchTitle = document.getElementById("searchBookTitle").value.toLowerCase();
    const books = getBooksFromLocalStorage();
    const filteredBooks = books.filter(book => book.title.toLowerCase().includes(searchTitle));

    // Menampilkan buku yang sesuai hasil pencarian
    displayBooks(filteredBooks);
});

// Menampilkan buku saat halaman dimuat
document.addEventListener("DOMContentLoaded", displayBooks);