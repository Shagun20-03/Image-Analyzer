document.addEventListener('DOMContentLoaded', () => {
  const fileInput = document.getElementById('fileInput');
  const uploadedImage = document.getElementById('uploadedImage');
  const analysisResults = document.getElementById('analysisResults');

  fileInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      uploadedImage.src = reader.result;
      analyzeImage(reader.result.split(',')[1]);
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  });

  async function analyzeImage(imageData) {
    try {
      // Send the imageData to the backend API for analysis
      const response = await fetch('http://localhost:5500/api/analyze-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imageData }),
      });

      if (!response.ok) {
        throw new Error('Image analysis failed');
      }

      const analysisResultsData = await response.json();

      // Display the analysis results in the 'analysisResults' div
      displayAnalysisResults(analysisResultsData);
    } catch (error) {
      console.error('Error analyzing image:', error);
      analysisResults.innerHTML = '<p>Image analysis failed. Please try again later.</p>';
    }
  }

  function displayAnalysisResults(results) {
    analysisResults.innerHTML = '<h2>Image Analysis Results:</h2>';

    if (results.metadata && results.metadata.width && results.metadata.height) {
      analysisResults.innerHTML += `<p>Dimensions: ${results.metadata.width} x ${results.metadata.height}</p>`;
    } else {
      analysisResults.innerHTML += '<p>Dimensions: N/A</p>';
    }

    if (results.color && results.color.dominantColors) {
      analysisResults.innerHTML += `<p>Dominant Colors: ${results.color.dominantColors.join(', ')}</p>`;
    } else {
      analysisResults.innerHTML += '<p>Dominant Colors: N/A</p>';
    }

    if (results.description && results.description.tags) {
      analysisResults.innerHTML += `<p>Objects Recognized: ${results.description.tags.join(', ')}</p>`;
    } else {
      analysisResults.innerHTML += '<p>Objects Recognized: N/A</p>';
    }
  }
});
