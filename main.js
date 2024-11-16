        // Variabel global untuk menyimpan skor dan pertanyaan
        let score = 0;
        let currentProblem = '';
        let correctAnswer = 0;

        // Fungsi untuk membuat soal matematika
        function generateProblem() {
            // Tambahkan operator pangkat ke dalam array operators
            const operators = ['+', '-', '*', '^'];
            const operator = operators[Math.floor(Math.random() * operators.length)];
            
            // Untuk operator pangkat, batasi angka agar hasilnya tidak terlalu besar
            let num1, num2;
            if (operator === '^') {
                num1 = Math.floor(Math.random() * 5) + 1;  // basis: 1-5
                num2 = Math.floor(Math.random() * 3) + 1;  // pangkat: 1-3
            } else {
                num1 = Math.floor(Math.random() * 10) + 1;
                num2 = Math.floor(Math.random() * 10) + 1;
            }

            // Hitung jawaban yang benar
            switch(operator) {
                case '+':
                    correctAnswer = num1 + num2;
                    break;
                case '-':
                    correctAnswer = num1 - num2;
                    break;
                case '*':
                    correctAnswer = num1 * num2;
                    break;
                case '^':
                    correctAnswer = Math.pow(num1, num2);
                    break;
            }

            // Tampilkan soal (gunakan superscript untuk pangkat)
            if (operator === '^') {
                document.getElementById('problem').innerHTML = `${num1}<sup>${num2}</sup>`;
            } else {
                document.getElementById('problem').textContent = `${num1} ${operator} ${num2}`;
            }

            // Atur pilihan jawaban
            const cards = document.querySelectorAll('.card-front');
            const answers = generateAnswerChoices(correctAnswer);
            
            cards.forEach((card, index) => {
                card.textContent = answers[index];
                card.dataset.value = answers[index];
            });
        }

        // Fungsi untuk menghasilkan pilihan jawaban
        function generateAnswerChoices(correctAnswer) {
            const choices = [correctAnswer];
            
            while(choices.length < 4) {
                // Sesuaikan range jawaban salah berdasarkan nilai correctAnswer
                const range = Math.max(2, Math.floor(correctAnswer * 0.3));
                const wrongAnswer = correctAnswer + (Math.floor(Math.random() * range * 2) - range);
                if (!choices.includes(wrongAnswer) && wrongAnswer > 0) {
                    choices.push(wrongAnswer);
                }
            }

            return choices.sort(() => Math.random() - 0.5);
        }

        // Fungsi untuk membalik kartu
        function flipCard(cardElement) {
            try {
                // Cegah multiple clicks saat animasi berjalan
                if (cardElement.classList.contains('flipped') || cardElement.classList.contains('processing')) return;
                
                cardElement.classList.add('processing'); // Tambah flag untuk mencegah multiple clicks
                cardElement.classList.add('flipped');

                const selectedAnswer = parseInt(cardElement.querySelector('.card-front').dataset.value);
                const cardBack = cardElement.querySelector('.card-back');
                
                // Bersihkan cardBack sebelum menambahkan konten baru
                cardBack.innerHTML = '';
                
                const img = document.createElement('img');
                img.style.width = '100%';
                img.style.height = '100%';
                img.style.objectFit = 'cover';
                
                if (selectedAnswer === correctAnswer) {
                    score++;
                    img.src = 'assets/giphy.gif';
                } else {
                    score--; // Prevent negative score
                    img.src = 'assets/banana-cat-crying.gif';
                }
                
                        // Di bagian update score
        if (score < 0) {
            document.getElementById('score').classList.add('negative');
        } else {
            document.getElementById('score').classList.remove('negative');
        }
                cardBack.appendChild(img);
                document.getElementById('score').textContent = `Score: ${score}`;

                // Gunakan Promise untuk memastikan cleanup yang proper
                const resetTimeout = setTimeout(() => {
                    try {
                        document.querySelectorAll('.card').forEach(card => {
                            card.classList.remove('flipped', 'processing');
                            const cardBack = card.querySelector('.card-back');
                            cardBack.innerHTML = '';
                        });
                        generateProblem();
                    } catch (error) {
                        console.error('Reset error:', error);
                    }
                }, 1000);

                // Simpan timer untuk dibersihkan jika diperlukan
                if (window.gameTimer) clearTimeout(window.gameTimer);
                window.gameTimer = resetTimeout;

            } catch (error) {
                console.error('Flip card error:', error);
                cardElement.classList.remove('processing', 'flipped');
            }
        }

        // Inisialisasi permainan
        generateProblem();

        // 1. Pastikan membersihkan event listener jika tidak digunakan
        function cleanup() {
            try {
                const cards = document.querySelectorAll('.card');
                cards.forEach(card => {
                    card.removeEventListener('click', flipCard);
                    card.classList.remove('flipped', 'processing');
                });
                if (window.gameTimer) {
                    clearTimeout(window.gameTimer);
                    window.gameTimer = null;
                }
            } catch (error) {
                console.error('Cleanup error:', error);
            }
        }

        // 2. Reset variabel setelah setiap ronde
        function resetGame() {
            // Reset semua variabel state
            score = 0;
            flippedCards = [];
            // ... variabel lainnya
        }

        // 3. Bersihkan timer
        function clearGameTimers() {
            if (gameTimer) {
                clearTimeout(gameTimer);
                gameTimer = null;
            }
        }

