import { showSwalSuccessToast, showSwalErrorToast } from "/javascript/helper/sweetAlertFunctions.js";

export function initializeTrustedIpAddressForm() {
    const ipAddressInput = document.getElementById('trusted-ip-address');
    const networkNameInput = document.getElementById('network-name');

    document.querySelector("#trusted-ip-address-form").addEventListener("submit", async (event) => {
        event.preventDefault();

        const trustedIpAddress = ipAddressInput.value;
        const networkName = networkNameInput.value;

        if (!networkName || networkName === "") {
            networkNameInput.classList.remove("border-gray-300");
            networkNameInput.classList.add("border-red-500");
            return;
        }
        if (!trustedIpAddress || trustedIpAddress === "") {
            ipAddressInput.classList.remove("border-gray-300");
            ipAddressInput.classList.add("border-red-500");
            return;
        }

        try {
            const response = await fetch("/api/ip-address", {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    networkName: networkName,
                    ipAddress: trustedIpAddress
                }),
            });

            const responseObject = await response.json();

            if (!response.ok) {
                showSwalErrorToast(responseObject.message);
                return;
            }

            showSwalSuccessToast(responseObject.message);

        } catch (error) {
            console.error(error);
        }
    });


    // remove error border red
    ipAddressInput.addEventListener('click', function () {
        ipAddressInput.classList.remove('border-red-500');
        ipAddressInput.classList.add('border-gray-300');
    });

    networkNameInput.addEventListener('click', function () {
        networkNameInput.classList.remove('border-red-500');
        networkNameInput.classList.add('border-gray-300');
    });
}

const showTrustedIpAddressSpan = document.getElementById('show-trusted-ips');
const dataTableContainer = document.getElementById('data-table-container');
const displayTableData = document.getElementById('display-table-data');

export function showTrustedIpAddress() {

    showTrustedIpAddressSpan.addEventListener('click', async () => {
        dataTableContainer.classList.remove('hidden');
        dataTableContainer.classList.add('block');
        dataTableContainer.classList.add('animate-slide-in');
        displayTableData.innerHTML = "";

        const ipAddress = await getAllIpAddress();

        // display ip address in table
        const table = document.createElement('table');
        table.classList.add('table');
        table.classList.add('w-full', 'border-collapse', 'rounded-lg', 'overflow-hidden');
        table.innerHTML = `
            <thead class="bg-blue-50">
                <tr>
                    <th class="text-left py-2">Network Name</th>
                    <th class="text-left py-2">IP Address</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                ${ipAddress.map(ip => `
                    <tr>
                            <td class="text-gray-500 font-medium py-2 border-b text-sm border-gray-300">${ip.network_name}</td>
                            <td class="text-gray-500 font-medium text-sm py-2 border-b border-gray-300">${ip.ip_address}</td>
                            <td class="text-gray-500 py-2 border-b text-sm border-gray-300">
                                <button class="bg-red-500 text-white text-xs px-2 py-1 rounded-md">Remove</button>
                            </td>
                    </tr>
                `).join('')}
            </tbody>
        `;
        displayTableData.innerHTML = `
            <div class="w-full mb-5 text-center">
                <p class="text-lg font-medium">List of Trusted IP Address</p>
            </div>
        `;
        displayTableData.appendChild(table);
    });
}

async function getAllIpAddress() {
    const response = await fetch("/api/ip-address/all");
    const responseObject = await response.json();

    return responseObject.ipAddress;
}

