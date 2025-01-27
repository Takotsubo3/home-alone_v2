const inventoryBar = document.getElementById('inventoryBar');

        function showInventoryBar() {
            inventoryBar.style.top = '0';
        }
        function hideInventoryBar() {
            inventoryBar.style.top = '-70px';
        }

        async function loadInventory() {
            try {
                const response = await fetch('inventaire.json');
                const data = await response.json();
                populateInventory(data);
            } catch (error) {
                console.error('Erreur lors du chargement de l\'inventaire:', error);
            }
        }


        function populateInventory(items) {
            const inventorySlots = document.querySelectorAll('.inventory-item');
            items.slice(0, 10).forEach((item, index) => {
                const slot = inventorySlots[index];
                slot.classList.remove('empty');
                slot.innerHTML = `
                    <img src="${item.image_url}"/>
                `;
            });
        }

loadInventory();
