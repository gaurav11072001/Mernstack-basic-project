import matplotlib.pyplot as plt
import matplotlib.patches as patches
import numpy as np
from PIL import Image, ImageDraw, ImageFont
import os

def create_mern_architecture_diagram():
    # Create figure and axis
    fig, ax = plt.subplots(figsize=(12, 8))
    
    # Set background color
    ax.set_facecolor('#f5f5f5')
    
    # Remove axis ticks and labels
    ax.set_xticks([])
    ax.set_yticks([])
    
    # Define component colors
    colors = {
        'client': '#FF9966',
        'frontend': '#66B2FF',
        'backend': '#99CC99',
        'database': '#C299CC',
        'arrow': '#666666'
    }
    
    # Define component positions
    positions = {
        'client': [0.1, 0.5],
        'frontend': [0.3, 0.5],
        'backend': [0.6, 0.5],
        'database': [0.85, 0.5]
    }
    
    # Draw components
    component_width = 0.15
    component_height = 0.25
    
    # Draw components
    for name, pos in positions.items():
        rect = patches.Rectangle(
            (pos[0] - component_width/2, pos[1] - component_height/2),
            component_width, component_height,
            linewidth=2,
            edgecolor='black',
            facecolor=colors[name],
            alpha=0.8,
            label=name
        )
        ax.add_patch(rect)
        
        # Add component name
        ax.text(
            pos[0], pos[1],
            name.upper(),
            ha='center',
            va='center',
            fontsize=12,
            fontweight='bold'
        )
    
    # Draw arrows between components
    arrow_props = dict(
        arrowstyle='->', 
        linewidth=2, 
        color=colors['arrow'],
        connectionstyle='arc3,rad=0.1'
    )
    
    # Client to Frontend
    ax.annotate(
        '', 
        xy=(positions['frontend'][0] - component_width/2, positions['frontend'][1]),
        xytext=(positions['client'][0] + component_width/2, positions['client'][1]),
        arrowprops=arrow_props
    )
    
    # Frontend to Client
    arrow_props_back = dict(
        arrowstyle='->', 
        linewidth=2, 
        color=colors['arrow'],
        connectionstyle='arc3,rad=-0.1'
    )
    ax.annotate(
        '', 
        xy=(positions['client'][0] + component_width/2, positions['client'][1] - 0.02),
        xytext=(positions['frontend'][0] - component_width/2, positions['frontend'][1] - 0.02),
        arrowprops=arrow_props_back
    )
    
    # Frontend to Backend
    ax.annotate(
        '', 
        xy=(positions['backend'][0] - component_width/2, positions['backend'][1]),
        xytext=(positions['frontend'][0] + component_width/2, positions['frontend'][1]),
        arrowprops=arrow_props
    )
    
    # Backend to Frontend
    ax.annotate(
        '', 
        xy=(positions['frontend'][0] + component_width/2, positions['frontend'][1] - 0.02),
        xytext=(positions['backend'][0] - component_width/2, positions['backend'][1] - 0.02),
        arrowprops=arrow_props_back
    )
    
    # Backend to Database
    ax.annotate(
        '', 
        xy=(positions['database'][0] - component_width/2, positions['database'][1]),
        xytext=(positions['backend'][0] + component_width/2, positions['backend'][1]),
        arrowprops=arrow_props
    )
    
    # Database to Backend
    ax.annotate(
        '', 
        xy=(positions['backend'][0] + component_width/2, positions['backend'][1] - 0.02),
        xytext=(positions['database'][0] - component_width/2, positions['database'][1] - 0.02),
        arrowprops=arrow_props_back
    )
    
    # Add component details
    details = {
        'client': ['Web Browser', 'Mobile App'],
        'frontend': ['React', 'Components', 'State Management', 'Routing'],
        'backend': ['Node.js', 'Express', 'API Routes', 'Authentication'],
        'database': ['MongoDB', 'Collections', 'Documents']
    }
    
    for name, detail_list in details.items():
        pos = positions[name]
        for i, detail in enumerate(detail_list):
            y_offset = 0.05 + 0.05 * i
            ax.text(
                pos[0], pos[1] - component_height/2 - y_offset,
                detail,
                ha='center',
                va='center',
                fontsize=9,
                style='italic'
            )
    
    # Add title
    ax.set_title('MERN Stack Architecture', fontsize=16, fontweight='bold', pad=20)
    
    # Add border
    ax.spines['top'].set_visible(True)
    ax.spines['right'].set_visible(True)
    ax.spines['bottom'].set_visible(True)
    ax.spines['left'].set_visible(True)
    
    # Save the figure
    plt.tight_layout()
    plt.savefig('mern_architecture.png', dpi=300, bbox_inches='tight')
    plt.close()
    
    print("MERN architecture diagram created: mern_architecture.png")

def create_project_structure_image():
    # Create a blank image
    width, height = 800, 600
    image = Image.new('RGB', (width, height), color='white')
    draw = ImageDraw.Draw(image)
    
    # Try to load a font
    try:
        font = ImageFont.truetype("arial.ttf", 14)
        title_font = ImageFont.truetype("arial.ttf", 18)
    except IOError:
        # Fallback to default
        font = ImageFont.load_default()
        title_font = ImageFont.load_default()
    
    # Draw title
    draw.text((20, 20), "MERN Stack Project Structure", fill="black", font=title_font)
    
    # Project structure text
    structure = """
mern-stack-project/
├── backend/                 # Node.js/Express backend
│   ├── middleware/          # Authentication middleware
│   ├── models/              # MongoDB schemas
│   ├── routes/              # API routes
│   ├── .env                 # Environment variables
│   ├── server.js            # Main server file
│   └── package.json         # Backend dependencies
│
├── frontend/                # React frontend
│   ├── public/              # Static assets
│   ├── src/                 # Source code
│   │   ├── components/      # React components
│   │   ├── context/         # Context providers
│   │   ├── pages/           # Page components
│   │   ├── utils/           # Utility functions
│   │   ├── App.js           # Main App component
│   │   └── index.js         # Entry point
│   └── package.json         # Frontend dependencies
│
├── .env                     # Root environment variables
└── package.json             # Root package with scripts
"""
    
    # Draw the structure
    draw.text((20, 60), structure, fill="black", font=font)
    
    # Save the image
    image.save('project_structure.png')
    print("Project structure image created: project_structure.png")

def create_data_flow_diagram():
    # Create figure and axis
    fig, ax = plt.subplots(figsize=(12, 6))
    
    # Set background color
    ax.set_facecolor('#f5f5f5')
    
    # Remove axis ticks and labels
    ax.set_xticks([])
    ax.set_yticks([])
    
    # Define steps and positions
    steps = [
        "User Interaction",
        "React Component",
        "API Request",
        "Server Processing",
        "Database Operation",
        "Response"
    ]
    
    # Create a flow diagram
    for i, step in enumerate(steps):
        # Calculate position
        x = 0.1 + i * 0.16
        y = 0.5
        
        # Draw box
        rect = patches.Rectangle(
            (x - 0.07, y - 0.15),
            0.14, 0.3,
            linewidth=2,
            edgecolor='black',
            facecolor=plt.cm.Blues(0.3 + i * 0.1),
            alpha=0.8
        )
        ax.add_patch(rect)
        
        # Add step name
        ax.text(
            x, y,
            step,
            ha='center',
            va='center',
            fontsize=10,
            fontweight='bold',
            wrap=True
        )
        
        # Add arrow (except for the last step)
        if i < len(steps) - 1:
            ax.arrow(
                x + 0.07, y,
                0.09, 0,
                head_width=0.02,
                head_length=0.01,
                fc='black',
                ec='black',
                linewidth=1.5
            )
    
    # Add title
    ax.set_title('MERN Stack Data Flow', fontsize=16, fontweight='bold', pad=20)
    
    # Add border
    for spine in ax.spines.values():
        spine.set_visible(True)
    
    # Save the figure
    plt.tight_layout()
    plt.savefig('data_flow.png', dpi=300, bbox_inches='tight')
    plt.close()
    
    print("Data flow diagram created: data_flow.png")

if __name__ == "__main__":
    print("Generating MERN stack architecture diagrams...")
    create_mern_architecture_diagram()
    create_project_structure_image()
    create_data_flow_diagram()
    print("All diagrams generated successfully!")
